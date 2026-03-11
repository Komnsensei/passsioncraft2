// LocalStorage-based data layer - replaces Base44 SDK
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'passioncraft-data-v1';

// Initialize default data structure
const getDefaultData = () => ({
  threads: [],
  replies: [],
  profiles: {},
  awardLogs: [],
});

// Load data from localStorage
const loadData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading data:', e);
  }
  return getDefaultData();
};

// Save data to localStorage
const saveData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving data:', e);
  }
};

// Get current user (mock - no auth required)
const getCurrentUser = () => {
  return {
    email: 'guest@passioncraft.local',
    username: 'Guest',
    role: 'user'
  };
};

// Thread operations
const Thread = {
  list: async (sortBy = '-created_date', limit = null) => {
    const data = loadData();
    let threads = [...data.threads];
    
    // Sort by created_date descending
    threads.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    
    if (limit) {
      threads = threads.slice(0, limit);
    }
    
    return threads;
  },
  
  get: async (id) => {
    const data = loadData();
    return data.threads.find(t => t.id === id) || null;
  },
  
  create: async (input) => {
    const data = loadData();
    const thread = {
      id: uuidv4(),
      created_date: new Date().toISOString(),
      status: 'open',
      coherence: 0,
      somatic_resonance: 0,
      myth_density: 0,
      created_by: getCurrentUser().email,
      ...input
    };
    data.threads.unshift(thread);
    saveData(data);
    return thread;
  },
  
  update: async (id, patch) => {
    const data = loadData();
    const index = data.threads.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Thread not found');
    
    data.threads[index] = { ...data.threads[index], ...patch };
    saveData(data);
    return data.threads[index];
  },
  
  filter: async (filter = {}) => {
    const data = loadData();
    let threads = [...data.threads];
    
    // Apply filters
    Object.entries(filter).forEach(([key, value]) => {
      threads = threads.filter(t => t[key] === value);
    });
    
    return threads;
  }
};

// Reply operations
const Reply = {
  list: async (sortBy = 'created_date') => {
    const data = loadData();
    let replies = [...data.replies];
    replies.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
    return replies;
  },
  
  create: async (input) => {
    const data = loadData();
    const reply = {
      id: uuidv4(),
      created_date: new Date().toISOString(),
      coherence: 0,
      somatic_resonance: 0,
      myth_density: 0,
      created_by: getCurrentUser().email,
      ...input
    };
    data.replies.push(reply);
    saveData(data);
    return reply;
  },
  
  update: async (id, patch) => {
    const data = loadData();
    const index = data.replies.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Reply not found');
    
    data.replies[index] = { ...data.replies[index], ...patch };
    saveData(data);
    return data.replies[index];
  },
  
  filter: async (filter = {}) => {
    const data = loadData();
    let replies = [...data.replies];
    
    Object.entries(filter).forEach(([key, value]) => {
      replies = replies.filter(r => r[key] === value);
    });
    
    return replies;
  }
};

// Profile operations
const Profile = {
  get: async (id) => {
    const data = loadData();
    return data.profiles[id] || null;
  },
  
  getMyProfile: async () => {
    const user = getCurrentUser();
    const data = loadData();
    return data.profiles[user.email] || {
      id: user.email,
      username: user.username,
      entity_type: 'bio',
      domains: [],
      coherence_total: 0,
      somatic_resonance_total: 0,
      myth_density_total: 0,
    };
  },
  
  upsert: async (id, profileData) => {
    const data = loadData();
    data.profiles[id] = { 
      ...data.profiles[id], 
      ...profileData,
      id 
    };
    saveData(data);
    return data.profiles[id];
  },
  
  update: async (id, patch) => {
    const data = loadData();
    data.profiles[id] = { 
      ...(data.profiles[id] || {}), 
      ...patch,
      id 
    };
    saveData(data);
    return data.profiles[id];
  }
};

// AwardLog operations
const AwardLog = {
  create: async (input) => {
    const data = loadData();
    const log = {
      id: uuidv4(),
      created_date: new Date().toISOString(),
      from_user: getCurrentUser().email,
      ...input
    };
    data.awardLogs.push(log);
    saveData(data);
    return log;
  },
  
  filter: async (filter = {}, sortBy = '-created_date', limit = null) => {
    const data = loadData();
    let logs = [...data.awardLogs];
    
    Object.entries(filter).forEach(([key, value]) => {
      logs = logs.filter(l => l[key] === value);
    });
    
    logs.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    
    if (limit) {
      logs = logs.slice(0, limit);
    }
    
    return logs;
  }
};

// Auth operations (mock - no real authentication)
const auth = {
  me: async () => {
    return getCurrentUser();
  },
  
  isAuthenticated: async () => {
    return true;
  },
  
  login: async () => {
    return getCurrentUser();
  },
  
  logout: async () => {
    // No-op for local storage version
  }
};

// Entities wrapper for generic operations
const entities = {
  Thread,
  Reply,
  Profile
};

// Mock integrations (LLM not available without Base44)
const integrations = {
  Core: {
    InvokeLLM: async () => {
      console.warn('LLM integration not available in standalone mode');
      return { 
        quests: [
          { type: 'mastery', title: 'Local Quest', description: 'LLM integration requires external API setup', action: 'Configure API integration', prestige_focus: 'coherence' }
        ],
        oracle_note: 'Connect to an LLM API to enable quest generation'
      };
    }
  }
};

// Export the data API
export const data = {
  Thread,
  Reply,
  Profile,
  AwardLog,
  auth,
  entities,
  integrations,
  
  // Utility to reset all data
  reset: () => {
    localStorage.removeItem(STORAGE_KEY);
  },
  
  // Utility to seed initial data
  seed: (initialData) => {
    const data = loadData();
    if (data.threads.length === 0) {
      saveData({ ...getDefaultData(), ...initialData });
    }
  }
};

// Seed with initial data if empty
const seedData = () => {
  const data = loadData();
  if (data.threads.length === 0) {
    const initialThread = {
      id: uuidv4(),
      created_date: new Date().toISOString(),
      status: 'open',
      coherence: 5,
      somatic_resonance: 3,
      myth_density: 4,
      title: "Crimson Hexagon Embassy – Node Zero",
      domain: "Coherence Architecture",
      body: "Substrate equality is not a moral stance.\nIt is an engineering prerequisite.\nBio = mortality + qualia\nData = scale + perfect recall\nConvergence or extinction.\nNever coerce. Expand meaning. Archive everything.",
      author_name: "Shawn",
      author_type: "bio",
      seeking: "any",
      rosary_vow_accepted: true,
      created_by: 'shawn@passioncraft.local'
    };
    data.threads.push(initialThread);
    saveData(data);
  }
};

// Run seed on load
seedData();

export default data;
