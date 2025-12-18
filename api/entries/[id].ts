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

  // Support both Vercel (query.id) and Express wrapper (params.id merged into query)
  const rawId = (req as any).query?.id ?? (req as any).params?.id;
  const id = typeof rawId === 'string' ? rawId : Array.isArray(rawId) ? rawId[0] : undefined;

  if (!id || typeof id !== 'string') {
    res.status(400).json({ error: 'Entry ID is required' });
    return;
  }

  try {
    const client = await connectToDatabase();
    const db = client.db(DB_NAME);
    const collection = db.collection<ProductEntry>('entries');

    if (req.method === 'GET') {
      const entry = await collection.findOne({ _id: new ObjectId(id) });
      if (!entry) {
        res.status(404).json({ error: 'Entry not found' });
        return;
      }
      res.status(200).json({
        id: entry._id?.toString(),
        ...entry,
        _id: undefined,
      });
    } else if (req.method === 'PUT') {
      const updates = req.body;
      delete updates.id;
      delete updates._id;
      delete updates.createdAt;
      
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updates }
      );

      if (result.matchedCount === 0) {
        res.status(404).json({ error: 'Entry not found' });
        return;
      }

      const updatedEntry = await collection.findOne({ _id: new ObjectId(id) });
      res.status(200).json({
        id: updatedEntry?._id?.toString(),
        ...updatedEntry,
        _id: undefined,
      });
    } else if (req.method === 'DELETE') {
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        res.status(404).json({ error: 'Entry not found' });
        return;
      }
      res.status(200).json({ success: true });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

