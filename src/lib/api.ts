// Determine API base URL
// In development with vercel dev, use relative URLs
// In production, use relative URLs (same origin)
const getApiBaseUrl = () => {
  // If explicitly set in env, use it
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // Use relative URL (works with both vercel dev and production)
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

export interface ProductEntry {
  id: string;
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

export interface AppConfig {
  projectName: string;
  companyUnits: string[];
}

export async function fetchEntries(): Promise<ProductEntry[]> {
  const response = await fetch(`${API_BASE_URL}/entries`);
  if (!response.ok) {
    throw new Error('Failed to fetch entries');
  }
  return response.json();
}

export async function fetchEntry(id: string): Promise<ProductEntry> {
  const response = await fetch(`${API_BASE_URL}/entries?id=${encodeURIComponent(id)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch entry');
  }
  const data = await response.json();

  // Backend may return either a single object or an array (depending on environment/cache)
  if (Array.isArray(data)) {
    const found = data.find((entry) => entry.id === id);
    if (!found) {
      throw new Error('Entry not found');
    }
    return found;
  }

  return data;
}

export async function createEntry(entry: Omit<ProductEntry, 'id' | 'createdAt'>): Promise<ProductEntry> {
  const response = await fetch(`${API_BASE_URL}/entries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entry),
  });
  if (!response.ok) {
    throw new Error('Failed to create entry');
  }
  return response.json();
}

export async function updateEntry(id: string, updates: Partial<ProductEntry>): Promise<ProductEntry> {
  const response = await fetch(`${API_BASE_URL}/entries?id=${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error('Failed to update entry');
  }
  return response.json();
}

export async function deleteEntry(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/entries?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete entry');
  }
}

export async function uploadImage(base64Image: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: base64Image }),
  });
  if (!response.ok) {
    throw new Error('Failed to upload image');
  }
  const data = await response.json();
  return data.url;
}

export async function fetchConfig(): Promise<AppConfig> {
  try {
    const response = await fetch(`${API_BASE_URL}/config`);
    if (!response.ok) {
      if (response.status === 404) {
        // Return default config if API is not available (fallback for development)
        console.warn('API route not found. Using default config. Make sure you are running "npm run dev:vercel"');
        return {
          projectName: 'PPE Manager',
          companyUnits: ['Company 1', 'Company 2'],
        };
      }
      throw new Error(`Failed to fetch config: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      // Return default config if API server is not running
      console.warn('Cannot connect to API. Using default config. Make sure you are running "npm run dev:vercel"');
      return {
        projectName: 'PPE Manager',
        companyUnits: ['Company 1', 'Company 2'],
      };
    }
    throw error;
  }
}

export async function updateProjectName(projectName: string): Promise<void> {
  const url = `${API_BASE_URL}/config`;
  console.log('🔍 API Call:', { method: 'POST', url, baseURL: API_BASE_URL });
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectName }),
    });
    
    console.log('📡 API Response:', { 
      status: response.status, 
      statusText: response.statusText,
      url: response.url,
      ok: response.ok 
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        console.error('❌ 404 Error - API route not found');
        console.error('💡 Solution: Run "npm run dev:vercel" (NOT "npm run dev")');
        console.error('💡 Check terminal for the correct port number');
        throw new Error('API route not found. Make sure you are running "npm run dev:vercel" (not "npm run dev"). Check the terminal for the correct port number.');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to update project name: ${response.status} ${response.statusText}`);
    }
    
    console.log('✅ API call successful');
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('❌ Network Error - Cannot connect to API');
      console.error('💡 Solution: Make sure "npm run dev:vercel" is running');
      console.error('💡 Check terminal output for the correct port');
      throw new Error('Cannot connect to API. Make sure you are running "npm run dev:vercel" to start the development server with API support. Check the terminal for the correct port number.');
    }
    throw error;
  }
}

