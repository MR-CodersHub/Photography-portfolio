// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// TODO: Replace with your actual Firebase Project configuration
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Mock Supabase using LocalStorage
// This allows the app to function "JS Only" without external DB connections for these tables.
class MockQuery {
    constructor(table) {
        this.table = table;
        // Read full data for filtering
        this.fullData = JSON.parse(localStorage.getItem(table) || '[]');
        this.currentData = [...this.fullData];
        this.isSingle = false;
    }

    select(selector) {
        return this;
    }

    order(col, { ascending } = { ascending: true }) {
        this.currentData.sort((a, b) => {
            if (a[col] < b[col]) return ascending ? -1 : 1;
            if (a[col] > b[col]) return ascending ? 1 : -1;
            return 0;
        });
        return this;
    }

    limit(n) {
        this.currentData = this.currentData.slice(0, n);
        return this;
    }

    eq(col, val) {
        this.currentData = this.currentData.filter(item => item[col] === val);
        return this;
    }

    single() {
        this.isSingle = true;
        return this;
    }

    async insert(row) {
        const rows = Array.isArray(row) ? row : [row];
        rows.forEach(r => {
            r.id = r.id || crypto.randomUUID();
            r.created_at = r.created_at || new Date().toISOString();
            this.fullData.push(r);
        });
        this._save();
        return { data: rows, error: null };
    }

    async upsert(row, options) {
        const rows = Array.isArray(row) ? row : [row];
        const key = options?.onConflict || 'email'; // Common default
        rows.forEach(r => {
            const index = this.fullData.findIndex(item => item[key] === r[key]);
            if (index >= 0) {
                this.fullData[index] = { ...this.fullData[index], ...r };
            } else {
                r.id = r.id || crypto.randomUUID();
                r.created_at = r.created_at || new Date().toISOString();
                this.fullData.push(r);
            }
        });
        this._save();
        return { data: rows, error: null };
    }

    _save() {
        localStorage.setItem(this.table, JSON.stringify(this.fullData));
    }

    // Thenable to resolve the query chain
    then(resolve, reject) {
        if (this.isSingle) {
            const item = this.currentData.length > 0 ? this.currentData[0] : null;
            resolve({ data: item, error: null }); // Supabase returns error if single() finds nothing, but null is safer for mock
        } else {
            resolve({ data: this.currentData, error: null });
        }
    }
}

const supabase = {
    from: (table) => new MockQuery(table)
};

// Export instances
export { auth, db, storage, supabase };

// Seed Data for Demo
(function seedData() {
    if (!localStorage.getItem('gallery')) {
        const galleryData = [
            { id: '1', title: 'Ethereal Peaks', category: 'landscape', image_path: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800', created_at: new Date().toISOString() },
            { id: '2', title: 'Urban Rhythms', category: 'urban', image_path: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=800', created_at: new Date().toISOString() },
            { id: '3', title: 'Golden Hour', category: 'portrait', image_path: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800', created_at: new Date().toISOString() },
            { id: '4', title: 'Silent Waters', category: 'nature', image_path: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=800', created_at: new Date().toISOString() },
            { id: '5', title: 'City Lights', category: 'urban', image_path: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80&w=800', created_at: new Date().toISOString() },
            { id: '6', title: 'Raw Emotion', category: 'portrait', image_path: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800', created_at: new Date().toISOString() }
        ];
        localStorage.setItem('gallery', JSON.stringify(galleryData));
    }

    // Seed Users (Admin)
    if (!localStorage.getItem('users')) {
        const userData = [
            {
                id: 'admin-1',
                email: 'admin@gmail.com',
                name: 'System Admin',
                role: 'admin',
                created_at: new Date().toISOString()
            }
        ];
        localStorage.setItem('users', JSON.stringify(userData));
    } else {
        // Ensure admin always exists in demo
        const users = JSON.parse(localStorage.getItem('users'));
        if (!users.find(u => u.email === 'admin@gmail.com')) {
            users.push({
                id: 'admin-1',
                email: 'admin@gmail.com',
                name: 'System Admin',
                role: 'admin',
                created_at: new Date().toISOString()
            });
            localStorage.setItem('users', JSON.stringify(users));
        }
    }

    if (!localStorage.getItem('blogs')) {
        const blogData = [
            { id: '1', title: 'Mastering Shadows', category: 'Technique', content: 'Shadows define the light. In this guide we explore...', image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800', created_at: new Date().toISOString() },
            { id: '2', title: 'The Gear We Use', category: 'Gear', content: 'Our lens choices for typical wedding shoots...', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800', created_at: new Date().toISOString() }
        ];
        localStorage.setItem('blogs', JSON.stringify(blogData));
    }

    // Seed Bookings
    if (!localStorage.getItem('bookings')) {
        const bookingData = [
            {
                id: '101',
                customer_name: 'Generic User',
                email: 'user@example.com',
                phone: '1234567890',
                service_type: 'Wedding Photography',
                booking_date: new Date().toISOString().split('T')[0],
                message: 'Demo booking',
                status: 'confirmed',
                total_price: 2800,
                created_at: new Date(Date.now() - 86400000).toISOString()
            }
        ];
        // We can't easily guess the current user's email here to seed specific data for them.
        localStorage.setItem('bookings', JSON.stringify(bookingData));
    }
})();
