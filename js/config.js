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
            { id: '1', title: 'Mountain Ceremony', category: 'wedding', image_path: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800', created_at: new Date().toISOString() },
            { id: '2', title: 'Beach Vows', category: 'wedding', image_path: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800', created_at: new Date().toISOString() },
            { id: '3', title: 'Golden Hour Portrait', category: 'portrait', image_path: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800', created_at: new Date().toISOString() },
            { id: '4', title: 'Studio Portrait', category: 'portrait', image_path: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800', created_at: new Date().toISOString() },
            { id: '5', title: 'Fashion Editorial', category: 'editorial', image_path: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800', created_at: new Date().toISOString() },
            { id: '6', title: 'Magazine Cover', category: 'editorial', image_path: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800', created_at: new Date().toISOString() },
            { id: '7', title: 'Silent Waters', category: 'nature', image_path: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800', created_at: new Date().toISOString() },
            { id: '8', title: 'Mountain View', category: 'nature', image_path: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=800', created_at: new Date().toISOString() }
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

    // Force seed/update blogs to version 3.0 (Professional Content Refresh)
    const blogsVersion = localStorage.getItem('blogs_version');
    if (blogsVersion !== '3.0' || !localStorage.getItem('blogs')) {
        localStorage.setItem('blogs_version', '3.0');
        const blogData = [
            {
                id: 'golden-hour',
                title: 'Mastering the Golden Hour',
                category: 'Photography',
                author: 'Elias Thorne',
                reading_time: '10 min',
                content: `
                    <p class="text-xl leading-relaxed text-white/90 font-normal">When it comes to outdoor photography, there is no tool more powerful or transformative than the "Golden Hour." This fleeting period, occurring just after sunrise and just before sunset, offers a quality of light that even the most expensive studio equipment struggles to replicate. In this guide, we'll explore how to harness this ethereal glow to elevate your imagery.</p>
                    
                    <h3 class="text-2xl font-black uppercase tracking-tight text-amber-500 mt-12 mb-6">Introduction: The Magic of Low-Angle Light</h3>
                    <p>The Golden Hour isn't just about the color; it's about the geometry. When the sun is near the horizon, its light travels through more of the atmosphere, scattering the harsh blue spectrum and leaving behind a warm, diffused spectrum of gold and crimson. This low-angle light creates long, soft shadows that define form and texture in a way that overhead noon-day sun never could.</p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 my-12 text-left">
                        <div class="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl">
                            <h4 class="text-white font-bold mb-4 flex items-center gap-2 italic uppercase tracking-widest text-[10px]">
                                <i data-lucide="sun" class="w-4 h-4 text-amber-500"></i> The Optics
                            </h4>
                            <p class="text-sm text-zinc-400">Atmospheric scattering is the secret. As the sun dips lower, its rays cover more distance through the air, scattering short-wavelength blue light and leaving behind the stunning, warm spectrum of orange and gold.</p>
                        </div>
                        <div class="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl">
                            <h4 class="text-white font-bold mb-4 flex items-center gap-2 italic uppercase tracking-widest text-[10px]">
                                <i data-lucide="camera" class="w-4 h-4 text-amber-500"></i> The Result
                            </h4>
                            <p class="text-sm text-zinc-400">Skin tones appear healthier and more radiant, and the world itself feels more cinematic. For landscape photographers, it’s the time when textures like sand and stone reveal their finest details through soft shadows.</p>
                        </div>
                    </div>

                    <h3 class="text-2xl font-black uppercase tracking-tight text-white mt-12 mb-6">Key Tips for Golden Hour Success</h3>
                    <ul class="space-y-4 text-zinc-400">
                        <li><strong class="text-white">1. Plan with Precision:</strong> The "hour" is often just 20-30 minutes. Use apps like Helios or Photopills to know exactly where the sun will be.</li>
                        <li><strong class="text-white">2. Shoot Wide Open:</strong> This is the perfect time for a shallow depth of field. Use an f/1.4 or f/1.8 aperture to create creamy bokeh.</li>
                        <li><strong class="text-white">3. Custom White Balance:</strong> Auto WB often tries to "neutralize" the beautiful warmth. Set your White Balance to 'Cloudy' or 'Shade'.</li>
                        <li><strong class="text-white">4. Use Backlighting:</strong> Position the sun directly behind your subject to create a "halo" or "rim light" effect.</li>
                    </ul>

                    <h3 class="text-2xl font-black uppercase tracking-tight text-white mt-12 mb-6">Practical Examples and Techniques</h3>
                    <p>Consider the difference between a portrait taken at noon and one during the Golden Hour. During the Golden Hour, the light hits the face at a horizontal angle, filling in shadows and creating beautiful "catchlights" in the eyes. In landscape photography, this light brings out the topography of the land, turning flat hills into dramatic, textured peaks.</p>

                    <h3 class="text-2xl font-black uppercase tracking-tight text-white mt-12 mb-6">Conclusion: Chase the Light</h3>
                    <p>Mastering the Golden Hour is about more than just settings; it's about observation. Watch how the colors change as the sun moves. Don't stop shooting as soon as the sun goes down—the "Blue Hour" that follows offers its own unique, cool-toned magic.</p>
                `,
                image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200',
                created_at: '2025-12-24T18:00:00Z'
            },
            {
                id: 'mirrorless-2026',
                title: 'Mirrorless Gear for 2026',
                category: 'Gear',
                author: 'Sarah Jenkins',
                reading_time: '12 min',
                content: `
                    <p class="text-xl leading-relaxed text-white/90 font-normal">The gear landscape of 2026 is unrecognizable compared to just a few years ago. We are no longer debating 'Mirrorless vs DSLR'—the conversation has moved to 'Sensor Capability vs AI Integration'.</p>
                    
                    <h3 class="text-2xl font-black uppercase tracking-tight text-amber-500 mt-12 mb-6">Introduction: The Era of the Intelligent Camera</h3>
                    <p>Today's mirrorless bodies are essentially powerful computers with a lens attached. The integration of dedicated AI chips has transformed autofocus from a mechanical process into a predictive one. Whether you're shooting moving wildlife or a complex wedding dance floor, the camera now anticipates movement before it happens.</p>
                    
                    <h3 class="text-2xl font-black uppercase tracking-tight text-white mt-12 mb-6">The Rise of Global Shutters</h3>
                    <p>The breakthrough of 2025-2026 has been the widespread adoption of global shutter sensors in flagship bodies. Unlike traditional sensors that read pixels line-by-line, global shutters read the entire sensor simultaneously. For the first time, photographers can shoot fast-moving subjects at any shutter speed without distortion.</p>
                    
                    <div class="bg-zinc-900 border border-zinc-800 p-10 rounded-3xl my-12 text-center">
                        <h4 class="text-amber-500 font-black uppercase tracking-tighter text-3xl mb-4 italic">Performance Peak</h4>
                        <p class="max-w-xl mx-auto text-zinc-400">"The global shutter doesn't just eliminate distortion; it eliminates technical limitations. It allows the photographer to focus purely on the moment."</p>
                    </div>

                    <h3 class="text-2xl font-black uppercase tracking-tight text-white mt-12 mb-6">Key Gear Recommendations</h3>
                    <ul class="space-y-4 text-zinc-400">
                        <li><strong class="text-white">Primary Body:</strong> Look for sensors with at least 45MP and dual-stream processing. AI-driven subject tracking is now a baseline requirement.</li>
                        <li><strong class="text-white">The Lens Kit:</strong> The 'Holy Trinity' (16-35mm, 24-70mm, 70-200mm) now features specialized motors for near-instant focus transitions.</li>
                        <li><strong class="text-white">Portable Lighting:</strong> High-speed sync strobe systems are now smaller than ever, fitting easily into a standard backpack.</li>
                    </ul>

                    <h3 class="text-2xl font-black uppercase tracking-tight text-white mt-12 mb-6">Practical Examples: Workflow Integration</h3>
                    <p>In the field, this gear translates to a higher "hit rate." During a recent sports assignment, our 2026-spec mirrorless bodies allowed us to capture the exact moment a ball compressed against a bat with zero distortion. In the studio, the eye-tracking is so precise it can hold focus on a model's iris even when they are wearing glasses.</p>

                    <h3 class="text-2xl font-black uppercase tracking-tight text-white mt-12 mb-6">Conclusion: Tools for the Visionary</h3>
                    <p>While the tech is impressive, remember that gear is merely a tool. The most advanced global shutter sensor in the world cannot replace a photographer's eye for composition and timing. Use these tools to remove technical barriers.</p>
                `,
                image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200',
                created_at: '2025-12-20T10:00:00Z'
            },
            {
                id: 'portrait-composition',
                title: 'Portrait Composition Mastery',
                category: 'Technique',
                author: 'Michael Chen',
                reading_time: '12 min',
                content: `
                    <p class="text-xl leading-relaxed text-white/90 font-normal">A truly successful portrait isn't just about technical settings; it's about the arrangement of elements within the frame that tells a story about the subject. Composition is the silent language of photography.</p>
                    
                    <h3 class="text-2xl font-black uppercase tracking-tight text-amber-500 mt-12 mb-6">Introduction: Framing the Human Experience</h3>
                    <p>When you look at a portrait, your eyes follow a path. Compositional mastery is the art of directing that path to the subject's soul. Whether you are using traditional "rules" or intentionally breaking them, every choice should serve the narrative of the shoot.</p>
                    
                    <h3 class="text-2xl font-black uppercase tracking-tight text-white mt-12 mb-6">The Rules of the Game</h3>
                    <ul class="space-y-4 text-zinc-400">
                        <li><strong class="text-white">The Rule of Thirds:</strong> Placing the subject's eyes or body along the grid lines to create balance.</li>
                        <li><strong class="text-white">Leading Lines:</strong> Using architectural features or the direction of a subject's gaze to point the viewer toward the focal point.</li>
                        <li><strong class="text-white">Framing within a Frame:</strong> Using windows or foliage to isolate the subject and add layers.</li>
                        <li><strong class="text-white">Negative Space:</strong> Utilizing empty areas to emphasize importance or peace.</li>
                    </ul>

                    <h3 class="text-2xl font-black uppercase tracking-tight text-white mt-12 mb-6">Key Tips for Better Portraits</h3>
                    <p class="text-zinc-400 leading-relaxed">1. <strong class="text-white">Eye Level Matters:</strong> Shooting from below can make a subject look powerful. <br> 2. <strong class="text-white">Mind the Background:</strong> A busy background can destroy a perfect expression. <br> 3. <strong class="text-white">Headroom:</strong> Don't leave too much space above the head unless it's intentional.</p>

                    <h3 class="text-2xl font-black uppercase tracking-tight text-white mt-12 mb-6">Practical Examples: Corporate vs Editorial</h3>
                    <p>For corporate portraits, clean symmetry conveys stability. For editorial work, however, we often place the subject on the far edge of the frame, looking into the "empty" space, to create a sense of mystery or intellectual depth.</p>

                    <h3 class="text-2xl font-black uppercase tracking-tight text-white mt-12 mb-6">Conclusion: Find Your Style</h3>
                    <p>Compositional Mastery is about intuition as much as it is about rules. Once you've learned the standard frameworks, the real magic happens when you start breaking them for a reason. Keep experimenting.</p>
                `,
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1200',
                created_at: '2025-12-15T14:30:00Z'
            },
            {
                id: 'branding-photography',
                title: 'Branding Photography Ideas',
                category: 'Commercial',
                author: 'Elena Rossi',
                reading_time: '14 min',
                content: `
                    <p class="text-xl leading-relaxed text-white/90 font-normal">In the visual economy, your brand is defined by the images you put out. Branding photography has evolved from simple headshots into a full-scale narrative of your business lifestyle.</p>
                    
                    <h3 class="text-2xl font-black uppercase tracking-tight text-amber-500 mt-12 mb-6">Introduction: Beyond the Corporate Headshot</h3>
                    <p>Today's audience craves authenticity. They don't want to see you in front of a gray backdrop; they want to see you in your element—actually working, actually creating. Branding is about storytelling, not posing.</p>
                    
                    <h3 class="text-2xl font-black uppercase tracking-tight text-white mt-12 mb-6">Top Branding Photography Concepts</h3>
                    <ul class="space-y-4 text-zinc-400">
                        <li><strong class="text-white">The 'Day in the Life':</strong> Capture a sequence of actions from your routine. This builds trust through transparency.</li>
                        <li><strong class="text-white">Detail Branding:</strong> Close-ups of your tools and textures. These are perfect for creating a cohesive social media grid.</li>
                        <li><strong class="text-white">The Action Shot:</strong> You, actually doing the work. These photos are inherently dynamic.</li>
                    </ul>

                    <h3 class="text-2xl font-black uppercase tracking-tight text-white mt-12 mb-6">Design Tips for a Consistent Brand</h3>
                    <p>Stick to a color palette that matches your website and logo. If your brand is 'Modern and Clean', use high-key lighting. If it's 'Artisan', embrace deep shadows and warm, earthy tones.</p>

                    <h3 class="text-2xl font-black uppercase tracking-tight text-white mt-12 mb-6">Practical Examples: Success Stories</h3>
                    <p>We recently worked with a creative agency that replaced stock photos with custom branding imagery. Within three months, their engagement increased by 40%. Custom imagery humanizes the digital experience.</p>

                    <h3 class="text-2xl font-black uppercase tracking-tight text-white mt-12 mb-6">Conclusion: Investing in Authority</h3>
                    <p>Professional branding photography is an investment in your business authority. High-quality visuals signal that you take your work seriously. Don't leave your first impression to a smartphone selfie.</p>
                `,
                image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1200',
                created_at: '2024-09-21T09:00:00Z'
            },
            {
                id: 'event-storytelling',
                title: 'Event Storytelling Techniques',
                category: 'Technique',
                author: 'Markus Vane',
                reading_time: '11 min',
                content: `
                    <p class="text-xl leading-relaxed text-white/90 font-normal">An event is a living entity. To photograph it successfully, you must be part observer and part storyteller. Here is our approach to capturing those high-impact moments.</p>
                    
                    <h3 class="text-2xl font-black uppercase tracking-tight text-amber-500 mt-12 mb-6">Introduction: Capturing the Vibe</h3>
                    <p>Event photography is more than just a shot list. It's about capturing the "vibe"—the laughter between sessions, the intensity of a keynote, and the energy of the room. It’s about documenting how the event *felt*.</p>
                    
                    <h3 class="text-2xl font-black uppercase tracking-tight text-white mt-12 mb-6">Essential Storytelling Techniques</h3>
                    <ul class="space-y-4 text-zinc-400">
                        <li><strong class="text-white">Layered Compositions:</strong> Place someone in the blurred foreground to make the viewer feel like they are "in" the room.</li>
                        <li><strong class="text-white">Reaction Shots:</strong> Don't just photograph the speaker; photograph the audience's response. Expressions are powerful.</li>
                        <li><strong class="text-white">Detail Atmosphere:</strong> Close-ups of branding and lighting help set the scene for the final gallery.</li>
                    </ul>

                    <h3 class="text-2xl font-black uppercase tracking-tight text-white mt-12 mb-6">Key Tips for Event Pros</h3>
                    <p>Work with two bodies—one wide for environmental shots and one telephoto for candid portraits. Never use flash unless absolutely necessary; direct flash kills the atmosphere.</p>

                    <h3 class="text-2xl font-black uppercase tracking-tight text-white mt-12 mb-6">Practical Examples: Corporate Galas</h3>
                    <p>During a recent NYC gala, we focused on the kinetic energy of the room and the quiet moments of connection. The result was a gallery that felt modern, sophisticated, and alive.</p>

                    <h3 class="text-2xl font-black uppercase tracking-tight text-white mt-12 mb-6">Conclusion: Delivering the Narrative</h3>
                    <p>When you deliver an event gallery, it should read like a storybook. A structured delivery ensures your client can relive the success of their event frame by frame. Every moment counts.</p>
                `,
                image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200',
                created_at: '2024-08-10T11:20:00Z'
            },
            {
                id: 'editing-workflow',
                title: 'Editing Workflow Advice',
                category: 'Editorial',
                author: 'Sophie Laurent',
                reading_time: '15 min',
                content: `
                    <p class="text-xl leading-relaxed text-white/90 font-normal">Editing is where a raw file becomes a masterpiece. However, it can also be a time sink. A streamlined, professional workflow is essential for any working photographer.</p>
                    
                    <h3 class="text-2xl font-black uppercase tracking-tight text-amber-500 mt-12 mb-6">Introduction: The Digital Darkroom</h3>
                    <p>Your workflow starts long before you open an editing suite. It starts with organization and culling, and most importantly, how you preserve your artistic "voice" across a full session.</p>
                    
                    <h3 class="text-2xl font-black uppercase tracking-tight text-white mt-12 mb-6">The 5-Step Professional Workflow</h3>
                    <ol class="space-y-4 text-zinc-400">
                        <li><strong class="text-white">1. Strict Culling:</strong> Only keep the absolute best. Use specialized software to blaze through thousands of images quickly.</li>
                        <li><strong class="text-white">2. Global Corrections:</strong> Adjust exposure and white balance consistently across the entire shoot.</li>
                        <li><strong class="text-white">3. Artistic Grading:</strong> Apply your custom look—moody and filmic or bright and airy.</li>
                        <li><strong class="text-white">4. Local Adjustments:</strong> Final polish. Masking eyes for clarity and removing small blemishes.</li>
                        <li><strong class="text-white">5. Safe Export:</strong> Multi-point backups and professional delivery platforms.</li>
                    </ol>

                    <h3 class="text-2xl font-black uppercase tracking-tight text-white mt-12 mb-6">Efficiency Tips for Pros</h3>
                    <p>Learn your keyboard shortcuts. Every second saved per photo adds up to hours when editing a wedding. Invest in a high-accuracy monitor for absolute color fidelity.</p>

                    <h3 class="text-2xl font-black uppercase tracking-tight text-white mt-12 mb-6">Conclusion: Style is Discipline</h3>
                    <p>Editing is as much about what you *don't* do. Resist the urge to over-process. The best editing is invisible; it simply brings out the natural beauty that was already there. Your workflow is the bridge to quality.</p>
                `,
                image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=1200',
                created_at: '2024-07-05T15:45:00Z'
            },
            {
                id: 'storytelling',
                title: 'The Art of Storytelling',
                category: 'Lifestyle',
                author: 'David Wolfe',
                reading_time: '9 min',
                content: `
                    <p class="text-xl leading-relaxed text-white/90 font-normal">Photography is often called a silent language. A single frame has the power to convey a complex narrative, evoke deep nostalgia, or inspire future action. But how do we move beyond "taking a picture" to "telling a story"?</p>
                    
                    <h3 class="text-2xl font-black uppercase tracking-tight text-amber-500 mt-12 mb-6">The Decisive Moment</h3>
                    <p>Coined by Henri Cartier-Bresson, the "decisive moment" is that split second where the elements of a scene—light, movement, and emotion—align perfectly. It's about anticipation rather than reaction. As a photographer, your job is to wait for the story to unfold before your lens.</p>
                    
                    <h3 class="text-2xl font-black uppercase tracking-tight text-white mt-12 mb-6">Details and Environment</h3>
                    <p>Sometimes the story isn't in the face of the subject, but in the environment around them. A close-up of weathered hands, a discarded toy, or the way light hits a dusty window can provide more context than a standard wide shot ever could. These details are the "adjectives" of your visual sentence.</p>
                    
                    <div class="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl my-12 italic text-zinc-400">
                        "Your first 10,000 photographs are your worst. The story begins once you stop worrying about the settings and start looking at the soul of the scene."
                    </div>

                    <h3 class="text-2xl font-black uppercase tracking-tight text-white mt-12 mb-6">Embracing Imperfection</h3>
                    <p>Technical perfection is secondary to emotional truth. A slightly blurry shot of a genuine laugh is infinitely more valuable than a tack-sharp image of a forced one. Look for the raw, the unscripted, and the real. Authenticity is the most powerful storytelling tool we possess.</p>
                `,
                image: 'https://images.unsplash.com/photo-1502602730242-116df9ae612b?auto=format&fit=crop&q=80&w=1200',
                created_at: '2024-06-12T13:00:00Z'
            },
            {
                id: 'ai-ethics',
                title: 'The Ethics of AI in Photography',
                category: 'Editorial',
                author: 'Dr. Aris Thorne',
                reading_time: '15 min',
                content: `
                    <p class="text-xl leading-relaxed text-white/90 font-normal">As AI tools become integrated into our editing workflows, the photography community is facing a fundamental question: At what point does an image stop being a photograph and start being a digital illustration?</p>
                    
                    <h3 class="text-2xl font-black uppercase tracking-tight text-amber-500 mt-12 mb-6">Correction vs. Manipulation</h3>
                    <p>We've always retouched images, from darkroom dodging and burning to digital skin smoothing. However, generative AI allows us to add entire elements that weren't there or change the environment completely. The line usually lies in "intent" and "transparency." Are we representing reality, or creating a new one?</p>
                    
                    <h3 class="text-2xl font-black uppercase tracking-tight text-white mt-12 mb-6">The Value of Authenticity</h3>
                    <p>In a world where anyone can generate a "perfect" landscape with a text prompt, the value of the 'real' increases. The sweat, the actual sunrise, and the physical presence of the photographer are becoming the new luxury in imagery. Human error is becoming a hallmark of human-made art.</p>
                    
                    <p class="mt-8 italic text-zinc-500">We believe in using AI as a tool for enhancement—reducing noise, improving focus, or removing a stray hair—while remaining committed to capturing the actual reality of the human experience. Trust is our most valuable asset.</p>
                `,
                image: 'https://images.unsplash.com/photo-1493863641943-9b68992a8d07?auto=format&fit=crop&q=80&w=1200',
                created_at: '2025-12-10T12:00:00Z'
            },
            {
                id: 'print-matters',
                title: 'Why Print Still Matters in 2026',
                category: 'Technique',
                author: 'Julian Reed',
                reading_time: '8 min',
                content: `
                    <p class="text-xl leading-relaxed text-white/90 font-normal">In an era of endless scrolling and disposable digital content, the physical print has become a radical act of preservation. Holding a photograph in your hands is a visceral experience that a screen simply cannot replicate.</p>
                    
                    <h3 class="text-2xl font-black uppercase tracking-tight text-amber-500 mt-12 mb-6">The Tangibility of Memory</h3>
                    <p>There is a weight to a print, both literally and figuratively. When you hang a photo on your wall, it becomes part of your daily environment, a permanent fixture in your story rather than a file lost in a cloud of thousands. Prints are the only technology that doesn't require a charger or a software update.</p>
                    
                    <h3 class="text-2xl font-black uppercase tracking-tight text-white mt-12 mb-6">The True Test of an Image</h3>
                    <p>Software and screens can hide many flaws. A large-format print reveals the true quality of the light, the depth of the shadows, and the precision of the focus. Printing forces us to be more intentional with our work. It is the final stage of the creative process.</p>
                    
                    <p class="mt-8 text-zinc-400">At Lumina Studio, we always encourage our clients to take at least one image from their session to a professional lab. It's the difference between a moment that's seen once, and a legacy that's kept forever. Your history deserves to be tangible.</p>
                `,
                image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80&w=1200',
                created_at: '2025-11-20T10:00:00Z'
            },
            {
                id: 'aurora-hunting',
                title: 'Chasing the Aurora',
                category: 'Travel',
                author: 'Nils Berg',
                reading_time: '11 min',
                content: `
                    <p class="text-xl leading-relaxed text-white/90 font-normal">Capturing the Northern Lights is a bucket-list dream for many photographers, but it requires as much patience and technical preparation as it does luck. Here is what I’ve learned from my many nights in the Arctic Circle.</p>
                    
                    <h3 class="text-2xl font-black uppercase tracking-tight text-amber-500 mt-12 mb-6">Know the Kp-Index</h3>
                    <p>The Kp-index measures geomagnetic activity. A Kp of 3 or 4 is great for high latitudes, while a Kp of 6 or 7 can bring the lights much further south. Use apps like "Aurora Forecast" to track solar wind speeds in real-time. Planning is half the battle when chasing the lights.</p>
                    
                    <h3 class="text-2xl font-black uppercase tracking-tight text-white mt-12 mb-6">Camera Settings for the Night</h3>
                    <p>Use a wide-angle lens (14mm to 24mm) with a fast aperture (f/2.8 or better). Start with ISO 1600-3200 and a shutter speed between 2 to 8 seconds. If the lights are moving fast, use a shorter shutter speed to capture the "curtain" textures without blurring the motion too much.</p>
                    
                    <h3 class="text-2xl font-black uppercase tracking-tight text-white mt-12 mb-6">Composition in the Dark</h3>
                    <p>The lights are spectacular, but they need a foreground to provide scale and context. Find a cabin, a mountain, or a frozen lake to anchor your image. And most importantly—keep your spare batteries inside your coat! The extreme cold will drain them in minutes if left exposed.</p>
                `,
                image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1200',
                created_at: '2025-10-05T22:00:00Z'
            }
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
