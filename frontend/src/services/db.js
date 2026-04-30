// Use PouchDB from global window object (loaded via CDN)
const PouchDB = window.PouchDB;

// Connect to IBM Cloudant using PouchDB
const cloudantUrl = import.meta.env.VITE_CLOUDANT_URL;

// Always use local database first so past inquiries are accessible
export const db = new PouchDB('local_inquiries');

// If Cloudant URL is provided, set up 2-way sync
if (cloudantUrl) {
  db.sync(cloudantUrl, {
    live: true,
    retry: true
  }).on('change', function (info) {
    console.log('Cloudant sync change:', info);
  }).on('error', function (err) {
    console.error('Cloudant sync error:', err);
  });
}

export const saveInquiry = async (userQuery, responseData) => {
  try {
    const doc = {
      _id: new Date().toISOString() + '-' + Math.random().toString(36).substring(2, 9),
      query: userQuery,
      response: responseData,
      timestamp: new Date().toISOString()
    };
    const response = await db.put(doc);
    return response.id;
  } catch (e) {
    console.error("Error adding document to PouchDB: ", e);
  }
};

export const getInquiries = async () => {
  try {
    const result = await db.allDocs({
      include_docs: true
    });
    
    const docs = result.rows.map(row => row.doc);
    // Sort manually by timestamp (descending)
    docs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    if (docs.length === 0) {
       return [
         { id: '1', query: "Eviction without notice", timestamp: new Date().toISOString(), response: { plain_explanation: "This is a dummy fallback until Cloudant sync is established or you make a query." } }
       ];
    }
    
    return docs;
  } catch (e) {
    console.error("Error getting documents from PouchDB: ", e);
    return [];
  }
};
