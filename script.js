// BloomWell - Old Money Wellness App JavaScript

class BloomWell {
    constructor() {
        this.currentTab = 'wellness';
        this.timers = new Map();
        this.habits = new Map();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserData();
        this.initializeHabits();
        this.setupMoodSelector();
        this.setupChat();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Habit progress dots
        document.querySelectorAll('.progress-dot').forEach(dot => {
            dot.addEventListener('click', (e) => this.toggleHabitProgress(e.target));
        });

        // Chat input
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }

        // Energy meter interaction
        this.setupEnergyMeter();
    }

    switchTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Show corresponding content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        this.currentTab = tabName;
        this.trackUserInteraction('tab_switch', { tab: tabName });
    }

    initializeHabits() {
        const defaultHabits = [
            { 
                id: 'hydration', 
                name: 'Hydration', 
                target: 8, 
                completed: 5, 
                streak: 12,
                icon: 'water'
            },
            { 
                id: 'meditation', 
                name: 'Mindfulness', 
                target: 1, 
                completed: 1, 
                streak: 8,
                icon: 'meditation'
            },
            { 
                id: 'movement', 
                name: 'Movement', 
                target: 1, 
                completed: 0, 
                streak: 15,
                icon: 'movement'
            },
            { 
                id: 'rest', 
                name: 'Rest', 
                target: 1, 
                completed: 1, 
                streak: 3,
                icon: 'rest'
            }
        ];

        defaultHabits.forEach(habit => {
            this.habits.set(habit.id, habit);
        });
    }

    toggleHabitProgress(dot) {
        const habitItem = dot.closest('.habit-item');
        const habitId = this.getHabitIdFromItem(habitItem);
        
        if (dot.classList.contains('completed')) {
            dot.classList.remove('completed');
            this.decrementHabit(habitId);
        } else {
            dot.classList.add('completed');
            this.incrementHabit(habitId);
        }

        this.saveUserData();
        this.showToast('Progress updated');
    }

    getHabitIdFromItem(item) {
        const habitName = item.querySelector('.habit-details h4').textContent.toLowerCase();
        return habitName === 'hydration' ? 'hydration' :
               habitName === 'mindfulness' ? 'meditation' :
               habitName === 'movement' ? 'movement' : 'rest';
    }

    incrementHabit(habitId) {
        const habit = this.habits.get(habitId);
        if (habit && habit.completed < habit.target) {
            habit.completed++;
            this.updateHabitDisplay(habitId);
        }
    }

    decrementHabit(habitId) {
        const habit = this.habits.get(habitId);
        if (habit && habit.completed > 0) {
            habit.completed--;
            this.updateHabitDisplay(habitId);
        }
    }

    updateHabitDisplay(habitId) {
        // This would update the UI to reflect the new habit progress
        // Implementation depends on specific UI structure
    }

    setupMoodSelector() {
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove previous selection
                document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
                
                // Add selection to clicked button
                btn.classList.add('selected');
                
                const mood = btn.dataset.mood;
                this.updateMood(parseInt(mood));
                this.showToast('Mood recorded');
            });
        });
    }

    updateMood(moodLevel) {
        const moodData = {
            level: moodLevel,
            timestamp: new Date().toISOString(),
            date: new Date().toDateString()
        };

        // Store mood data
        this.saveMoodData(moodData);
        
        // Update insights based on mood
        this.updateMoodInsights(moodLevel);
    }

    saveMoodData(moodData) {
        const moods = JSON.parse(localStorage.getItem('bloomwell_moods') || '[]');
        moods.push(moodData);
        
        // Keep only last 30 days of data
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const filteredMoods = moods.filter(mood => 
            new Date(mood.timestamp) > thirtyDaysAgo
        );
        
        localStorage.setItem('bloomwell_moods', JSON.stringify(filteredMoods));
    }

    updateMoodInsights(moodLevel) {
        // Calculate mood trends and update insights
        const moods = JSON.parse(localStorage.getItem('bloomwell_moods') || '[]');
        const recentMoods = moods.slice(-7); // Last 7 entries
        
        if (recentMoods.length > 1) {
            const avgMood = recentMoods.reduce((sum, mood) => sum + mood.level, 0) / recentMoods.length;
            const trend = avgMood > 3.5 ? 'improving' : avgMood < 2.5 ? 'declining' : 'stable';
            
            // Update insights display
            this.updateInsightDisplay('mood', `Your mood has been ${trend} this week (avg: ${avgMood.toFixed(1)})`);
        }
    }

    updateInsightDisplay(type, message) {
        const insightItem = document.querySelector(`.insight-item h4:contains("${type}")`);
        if (insightItem) {
            const p = insightItem.nextElementSibling;
            if (p) p.textContent = message;
        }
    }

    setupEnergyMeter() {
        const meterTrack = document.querySelector('.meter-track');
        if (meterTrack) {
            meterTrack.addEventListener('click', (e) => {
                const rect = meterTrack.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percentage = Math.round((clickX / rect.width) * 100);
                
                this.updateEnergyLevel(Math.max(0, Math.min(100, percentage)));
            });
        }
    }

    updateEnergyLevel(percentage) {
        const fill = document.querySelector('.meter-fill');
        const value = document.querySelector('.meter-value');
        
        if (fill) fill.style.width = `${percentage}%`;
        if (value) value.textContent = `${percentage}%`;
        
        // Store energy data
        this.saveEnergyData(percentage);
        this.showToast(`Energy level set to ${percentage}%`);
    }

    saveEnergyData(level) {
        const energyData = {
            level: level,
            timestamp: new Date().toISOString(),
            date: new Date().toDateString()
        };
        
        localStorage.setItem('bloomwell_energy', JSON.stringify(energyData));
    }

    setupChat() {
        // Initialize chat with welcome message if empty
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages && chatMessages.children.length === 0) {
            this.addChatMessage('assistant', 'Good day. How may I assist you with your wellness journey today?');
        }
    }

    sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (message) {
            this.addChatMessage('user', message);
            input.value = '';
            
            // Simulate AI response
            setTimeout(() => {
                const response = this.generateAIResponse(message);
                this.addChatMessage('assistant', response);
            }, 1000);
        }
    }

    addChatMessage(sender, message) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        
        messageDiv.innerHTML = `
            <div class="message-avatar ${sender}-avatar"></div>
            <div class="message-bubble">
                <p>${message}</p>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    generateAIResponse(userMessage) {
        const responses = {
            stress: "Consider incorporating deep breathing exercises into your routine. The 4-7-8 technique can be particularly effective for managing stress.",
            sleep: "Establishing a consistent bedtime routine is essential. Try reducing screen time an hour before bed and maintaining a cool, dark environment.",
            study: "The Pomodoro Technique remains highly effective - 25 minutes of focused work followed by a 5-minute break. This helps maintain concentration while preventing burnout.",
            energy: "Regular movement, even brief walks, can significantly boost energy levels. Consider scheduling short activity breaks throughout your day.",
            mood: "Mindfulness practices and gratitude journaling have shown remarkable benefits for mood regulation. Small, consistent actions often yield the most meaningful results.",
            default: "That's an excellent question. Wellness is a journey of small, consistent improvements. What specific area would you like to focus on today?"
        };

        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelm')) {
            return responses.stress;
        } else if (lowerMessage.includes('sleep') || lowerMessage.includes('tired')) {
            return responses.sleep;
        } else if (lowerMessage.includes('study') || lowerMessage.includes('focus')) {
            return responses.study;
        } else if (lowerMessage.includes('energy') || lowerMessage.includes('motivation')) {
            return responses.energy;
        } else if (lowerMessage.includes('mood') || lowerMessage.includes('feel')) {
            return responses.mood;
        } else {
            return responses.default;
        }
    }

    startTimer(button) {
        const sessionItem = button.closest('.session-item');
        const timerDisplay = sessionItem.querySelector('.timer-display');
        const sessionName = sessionItem.querySelector('.session-details h4').textContent;
        
        if (button.classList.contains('playing')) {
            this.pauseTimer(sessionName, button, timerDisplay);
        } else {
            this.playTimer(sessionName, button, timerDisplay);
        }
    }

    playTimer(sessionName, button, display) {
        const timeText = display.textContent;
        const [minutes, seconds] = timeText.split(':').map(Number);
        let totalSeconds = minutes * 60 + seconds;
        
        button.classList.add('playing');
        button.innerHTML = '<i class="fas fa-pause"></i>';
        
        const timer = setInterval(() => {
            if (totalSeconds <= 0) {
                this.completeTimer(sessionName, button, display);
                return;
            }
            
            totalSeconds--;
            const mins = Math.floor(totalSeconds / 60);
            const secs = totalSeconds % 60;
            display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }, 1000);
        
        this.timers.set(sessionName, timer);
        this.showToast(`${sessionName} session started`);
    }

    pauseTimer(sessionName, button, display) {
        const timer = this.timers.get(sessionName);
        if (timer) {
            clearInterval(timer);
            this.timers.delete(sessionName);
        }
        
        button.classList.remove('playing');
        button.innerHTML = '<i class="fas fa-play"></i>';
        this.showToast(`${sessionName} session paused`);
    }

    completeTimer(sessionName, button, display) {
        this.pauseTimer(sessionName, button, display);
        display.textContent = '00:00';
        this.showToast(`${sessionName} session completed!`);
        
        // Update study statistics
        this.updateStudyStats(sessionName);
    }

    updateStudyStats(sessionName) {
        const studyStats = JSON.parse(localStorage.getItem('bloomwell_study') || '{}');
        const today = new Date().toDateString();
        
        if (!studyStats[today]) {
            studyStats[today] = {};
        }
        
        if (!studyStats[today][sessionName]) {
            studyStats[today][sessionName] = 0;
        }
        
        studyStats[today][sessionName]++;
        localStorage.setItem('bloomwell_study', JSON.stringify(studyStats));
    }

    addNewHabit() {
        const habitName = prompt('Enter a name for your new ritual:');
        if (habitName) {
            const habitId = habitName.toLowerCase().replace(/\s+/g, '_');
            const newHabit = {
                id: habitId,
                name: habitName,
                target: 1,
                completed: 0,
                streak: 0,
                icon: 'custom'
            };
            
            this.habits.set(habitId, newHabit);
            this.renderHabitList();
            this.saveUserData();
            this.showToast(`New ritual "${habitName}" added`);
        }
    }

    renderHabitList() {
        const habitList = document.querySelector('.habit-list');
        if (!habitList) return;
        
        habitList.innerHTML = '';
        
        this.habits.forEach(habit => {
            const habitElement = this.createHabitElement(habit);
            habitList.appendChild(habitElement);
        });
    }

    createHabitElement(habit) {
        const div = document.createElement('div');
        div.className = 'habit-item';
        
        const progressDots = Array.from({ length: habit.target }, (_, i) => 
            `<div class="progress-dot ${i < habit.completed ? 'completed' : ''}"></div>`
        ).join('');
        
        div.innerHTML = `
            <div class="habit-content">
                <div class="habit-icon ${habit.icon}"></div>
                <div class="habit-details">
                    <h4>${habit.name}</h4>
                    <span class="habit-streak">${habit.streak} day streak</span>
                </div>
            </div>
            <div class="habit-progress">
                <div class="progress-dots">
                    ${progressDots}
                </div>
            </div>
        `;
        
        return div;
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }

    trackUserInteraction(action, data = {}) {
        const interaction = {
            action,
            data,
            timestamp: new Date().toISOString(),
            tab: this.currentTab
        };
        
        // Store interaction data for analytics
        const interactions = JSON.parse(localStorage.getItem('bloomwell_interactions') || '[]');
        interactions.push(interaction);
        
        // Keep only last 100 interactions
        if (interactions.length > 100) {
            interactions.splice(0, interactions.length - 100);
        }
        
        localStorage.setItem('bloomwell_interactions', JSON.stringify(interactions));
    }

    loadUserData() {
        // Load mood data
        const moodData = localStorage.getItem('bloomwell_energy');
        if (moodData) {
            const { level } = JSON.parse(moodData);
            this.updateEnergyLevel(level);
        }

        // Load habit data
        const habitData = localStorage.getItem('bloomwell_habits');
        if (habitData) {
            const savedHabits = JSON.parse(habitData);
            savedHabits.forEach(habit => {
                this.habits.set(habit.id, habit);
            });
            this.renderHabitList();
        }
    }

    saveUserData() {
        // Save habits
        const habitsArray = Array.from(this.habits.values());
        localStorage.setItem('bloomwell_habits', JSON.stringify(habitsArray));
        
        // Update statistics
        this.updateStatistics();
    }

    updateStatistics() {
        // Calculate completion rate
        let totalTargets = 0;
        let totalCompleted = 0;
        
        this.habits.forEach(habit => {
            totalTargets += habit.target;
            totalCompleted += habit.completed;
        });
        
        const completionRate = totalTargets > 0 ? Math.round((totalCompleted / totalTargets) * 100) : 0;
        
        // Update completion stat display
        const completionStat = document.querySelector('.stat-number');
        if (completionStat) {
            completionStat.textContent = `${completionRate}%`;
        }
    }

    // Calendar functionality for period tracking
    initializeCalendar() {
        const calendarDays = document.querySelectorAll('.calendar-day');
        calendarDays.forEach(day => {
            day.addEventListener('click', (e) => {
                this.handleCalendarClick(e.target);
            });
        });
    }

    handleCalendarClick(dayElement) {
        const day = parseInt(dayElement.textContent);
        if (isNaN(day)) return;
        
        // Toggle period marking
        if (dayElement.classList.contains('period')) {
            dayElement.classList.remove('period');
        } else {
            dayElement.classList.add('period');
        }
        
        this.savePeriodData();
        this.showToast('Period data updated');
    }

    savePeriodData() {
        const periodDays = Array.from(document.querySelectorAll('.calendar-day.period'))
            .map(day => parseInt(day.textContent))
            .filter(day => !isNaN(day));
        
        const periodData = {
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
            days: periodDays
        };
        
        localStorage.setItem('bloomwell_period', JSON.stringify(periodData));
    }
}

// Global functions for inline event handlers
window.startTimer = function(button) {
    app.startTimer(button);
};

window.sendMessage = function() {
    app.sendMessage();
};

window.addNewHabit = function() {
    app.addNewHabit();
};

// Initialize the application
const app = new BloomWell();

// Export for Node.js environment if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BloomWell;
}