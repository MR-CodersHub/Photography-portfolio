<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: ../signin.html');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Dashboard | Lumina Studio</title>
    <!-- Use Tailwind and Main Styles to strictly follow theme -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../styles.css">
    <style>
        /* Dashboard specific overrides */
        .glass-panel {
            background: rgba(24, 24, 27, 0.6);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 1.5rem;
        }
    </style>
</head>
<body class="bg-zinc-950 text-white min-h-screen font-['Inter'] relative overflow-x-hidden">
    <!-- Grainy Overlay -->
    <div class="grainy-overlay fixed inset-0 pointer-events-none z-50"></div>

    <div class="flex h-screen overflow-hidden">
        <!-- Sidebar -->
        <aside class="w-64 bg-zinc-900/50 backdrop-blur-xl border-r border-zinc-800 flex flex-col relative z-40">
            <div class="p-8">
                <a href="../index.html" class="flex items-center space-x-3 group">
                    <div class="p-2 bg-zinc-900 rounded-lg border border-zinc-800 group-hover:border-amber-500 transition-colors">
                        <i data-lucide="camera" class="w-5 h-5 text-amber-500"></i>
                    </div>
                    <span class="text-lg font-black uppercase tracking-tighter">Lumina</span>
                </a>
            </div>
            
            <nav class="flex-1 px-4 space-y-2">
                <a href="dashboard.php" class="flex items-center space-x-3 px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-white">
                    <i data-lucide="layout-dashboard" class="w-5 h-5 text-amber-500"></i>
                    <span class="font-bold text-sm tracking-wide">Overview</span>
                </a>
                <a href="../booking.html" class="flex items-center space-x-3 px-4 py-3 text-zinc-400 hover:bg-white/5 hover:text-white rounded-xl transition-all">
                    <i data-lucide="plus-circle" class="w-5 h-5"></i>
                    <span class="font-bold text-sm tracking-wide">New Booking</span>
                </a>
                <a href="../index.html" class="flex items-center space-x-3 px-4 py-3 text-zinc-400 hover:bg-white/5 hover:text-white rounded-xl transition-all">
                    <i data-lucide="home" class="w-5 h-5"></i>
                    <span class="font-bold text-sm tracking-wide">Back to Home</span>
                </a>
            </nav>

            <div class="p-6 border-t border-zinc-800">
                <button onclick="logout()" class="flex items-center space-x-3 text-zinc-500 hover:text-red-400 transition-colors w-full">
                    <i data-lucide="log-out" class="w-5 h-5"></i>
                    <span class="font-bold text-xs uppercase tracking-widest">Sign Out</span>
                </button>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto relative p-8 md:p-12">
            <!-- Header -->
            <header class="flex justify-between items-center mb-12">
                <div>
                    <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2">My Dashboard</h1>
                    <p class="text-zinc-400">Welcome back, <span id="user-name" class="text-white">User</span></p>
                </div>
                <div class="p-1 rounded-full border border-zinc-800 bg-zinc-900/50">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-zinc-950 font-bold">
                        <i data-lucide="user"></i>
                    </div>
                </div>
            </header>

            <!-- Stats Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <!-- Stat 1 -->
                <div class="glass-panel p-6 relative overflow-hidden group">
                    <div class="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <i data-lucide="calendar-check" class="w-24 h-24 text-amber-500"></i>
                    </div>
                    <p class="text-amber-500 text-xs font-black uppercase tracking-widest mb-2">Total Bookings</p>
                    <h3 class="text-4xl font-black" id="my_bookings_count">-</h3>
                </div>
                <!-- Stat 2 -->
                <div class="glass-panel p-6 relative overflow-hidden group">
                     <div class="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <i data-lucide="clock" class="w-24 h-24 text-zinc-400"></i>
                    </div>
                    <p class="text-zinc-500 text-xs font-black uppercase tracking-widest mb-2">Pending</p>
                    <h3 class="text-4xl font-black" id="pending_count">-</h3>
                </div>
                <!-- Stat 3 -->
                  <div class="glass-panel p-6 relative overflow-hidden group">
                     <div class="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <i data-lucide="message-square" class="w-24 h-24 text-zinc-400"></i>
                    </div>
                    <p class="text-zinc-500 text-xs font-black uppercase tracking-widest mb-2">Messages</p>
                    <h3 class="text-4xl font-black">0</h3>
                </div>
            </div>

            <!-- Booking History -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold mb-6 flex items-center">
                    <i data-lucide="history" class="w-5 h-5 text-amber-500 mr-3"></i>
                    Booking History
                </h2>
                
                <div class="glass-panel overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left">
                            <thead class="bg-zinc-900/50 text-xs font-black uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
                                <tr>
                                    <th class="p-6">Service</th>
                                    <th class="p-6">Date</th>
                                    <th class="p-6">Status</th>
                                    <th class="p-6">Notes</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-zinc-800/50" id="bookings_table">
                                <tr>
                                    <td colspan="4" class="p-8 text-center text-zinc-500 animate-pulse">Scanning archives...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <script>
        lucide.createIcons();

        // Check Auth and Load Data
        async function initDashboard() {
            try {
                // Auth Check
                const authResp = await fetch('../backend/auth.php?action=check');
                const authData = await authResp.json();
                if(authData.authenticated) {
                    document.getElementById('user-name').innerText = authData.user;
                } else {
                    window.location.href = '../signin.html';
                    return;
                }

                // Load Data
                const response = await fetch('../backend/my_bookings.php');
                const bookings = await response.json();
                
                document.getElementById('my_bookings_count').innerText = bookings.length || 0;
                
                // Calculate Pending
                const pending = bookings.filter(b => b.status === 'pending').length;
                document.getElementById('pending_count').innerText = pending;

                const tbody = document.getElementById('bookings_table');
                tbody.innerHTML = '';
                
                if (bookings.length > 0) {
                    bookings.forEach(booking => {
                        const tr = document.createElement('tr');
                        tr.className = 'hover:bg-white/5 transition-colors';
                        
                        let statusClass = 'bg-zinc-800 text-zinc-400';
                        if(booking.status === 'confirmed') statusClass = 'bg-green-500/10 text-green-500 border border-green-500/20';
                        if(booking.status === 'pending') statusClass = 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
                        if(booking.status === 'cancelled') statusClass = 'bg-red-500/10 text-red-500 border border-red-500/20';

                        tr.innerHTML = `
                            <td class="p-6 font-bold text-white">${booking.service_type}</td>
                            <td class="p-6 text-zinc-400 font-mono text-sm">${booking.booking_date}</td>
                            <td class="p-6">
                                <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusClass}">
                                    ${booking.status}
                                </span>
                            </td>
                            <td class="p-6 text-sm text-zinc-500 italic max-w-xs truncate">${booking.message || 'No notes'}</td>
                        `;
                        tbody.appendChild(tr);
                    });
                } else {
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="4" class="p-12 text-center text-zinc-500">
                                <div class="flex flex-col items-center justify-center space-y-4">
                                    <div class="p-4 rounded-full bg-zinc-900 border border-zinc-800">
                                        <i data-lucide="camera-off" class="w-8 h-8 text-zinc-600"></i>
                                    </div>
                                    <p>No photography sessions booked yet.</p>
                                    <a href="../booking.html" class="text-amber-500 hover:text-white font-bold uppercase tracking-widest text-xs transition-colors">Start a Project</a>
                                </div>
                            </td>
                        </tr>
                    `;
                }
                lucide.createIcons();
            } catch (err) {
                console.error(err);
            }
        }

        async function logout() {
            await fetch('../backend/auth.php?action=logout');
            window.location.href = '../index.html';
        }

        initDashboard();
    </script>
</body>
</html>
