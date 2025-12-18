import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'entry_craft';

interface ProductEntry {
  _id?: string;
  date: string;
  challanNumber: string;
  unit: string;
  partyName: string;
  productName: string;
  widthImage?: string;
  widthValue?: string;
  lengthImage?: string;
  lengthValue?: string;
  heightImage?: string;
  heightValue?: string;
  processType: string;
  quantity: number;
  balanceQty?: number;
  returnQuantity?: number;
  packingDetails?: string;
  remarks?: string;
  signature?: string;
  authorizedBy: string;
  createdAt: string;
}

let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const client = await connectToDatabase();
    const db = client.db(DB_NAME);
    const collection = db.collection<ProductEntry>('entries');

    if (req.method === 'GET') {
      const entries = await collection.find({}).sort({ createdAt: -1 }).toArray();
      const formattedEntries = entries.map(entry => ({
        id: entry._id?.toString(),
        ...entry,
        _id: undefined,
      }));
      res.status(200).json(formattedEntries);
    } else if (req.method === 'POST') {
      const entry = req.body;
      const newEntry: Omit<ProductEntry, '_id'> = {
        ...entry,
        createdAt: new Date().toISOString(),
      };
      const result = await collection.insertOne(newEntry as ProductEntry);
      const insertedEntry = await collection.findOne({ _id: result.insertedId });
      res.status(201).json({
        id: insertedEntry?._id?.toString(),
        ...insertedEntry,
        _id: undefined,
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

