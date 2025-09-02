// BloomWell Analytics Engine - Pure JavaScript/Node.js
// Advanced wellness data analysis without Python dependencies

const fs = require('fs').promises;
const path = require('path');

class WellnessAnalyzer {
    constructor() {
        this.userData = new Map();
        this.insights = new Map();
    }

    // Load user data from local storage or files
    async loadUserData(userId, days = 30) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);

        // Simulate loading data - in real app, this would come from your database
        const mockData = {
            mood: this.generateMockMoodData(startDate, endDate),
            habits: this.generateMockHabitData(startDate, endDate),
            study: this.generateMockStudyData(startDate, endDate),
            period: this.generateMockPeriodData(startDate, endDate)
        };

        return mockData;
    }

    // Generate mock mood data for demonstration
    generateMockMoodData(startDate, endDate) {
        const moodData = [];
        const currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
            moodData.push({
                date: new Date(currentDate),
                mood_level: Math.floor(Math.random() * 5) + 1, // 1-5 scale
                energy_level: Math.floor(Math.random() * 100) + 1, // 1-100 scale
                notes: 'Feeling good today'
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return moodData;
    }

    // Generate mock habit data
    generateMockHabitData(startDate, endDate) {
        const habits = ['Hydration', 'Mindfulness', 'Movement', 'Rest'];
        const habitData = [];
        const currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
            habits.forEach(habit => {
                habitData.push({
                    name: habit,
                    date: new Date(currentDate),
                    completed: Math.random() > 0.3 ? 1 : 0,
                    target: 1
                });
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return habitData;
    }

    // Generate mock study data
    generateMockStudyData(startDate, endDate) {
        const subjects = ['Mathematics', 'Physics', 'Literature'];
        const studyData = [];
        const currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
            if (Math.random() > 0.4) { // Not every day has study sessions
                const subject = subjects[Math.floor(Math.random() * subjects.length)];
                studyData.push({
                    subject: subject,
                    date: new Date(currentDate),
                    duration_minutes: Math.floor(Math.random() * 60) + 15, // 15-75 minutes
                    completed: Math.random() > 0.2,
                    timestamp: new Date(currentDate)
                });
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return studyData;
    }

    // Generate mock period data
    generateMockPeriodData(startDate, endDate) {
        return []; // Simplified for now
    }

    // Calculate mood insights
    calculateMoodInsights(moodData) {
        if (!moodData || moodData.length === 0) {
            return { average: 0, trend: 'no_data', volatility: 0 };
        }

        // Calculate average mood
        const avgMood = moodData.reduce((sum, entry) => sum + entry.mood_level, 0) / moodData.length;
        
        // Calculate trend using simple linear regression
        const trend = this.calculateTrend(moodData.map((entry, index) => ({
            x: index,
            y: entry.mood_level
        })));

        // Calculate volatility (standard deviation)
        const variance = moodData.reduce((sum, entry) => {
            return sum + Math.pow(entry.mood_level - avgMood, 2);
        }, 0) / moodData.length;
        const volatility = Math.sqrt(variance);

        // Weekly patterns
        const weekdayMoods = {};
        moodData.forEach(entry => {
            const weekday = entry.date.toLocaleDateString('en', { weekday: 'long' });
            if (!weekdayMoods[weekday]) {
                weekdayMoods[weekday] = [];
            }
            weekdayMoods[weekday].push(entry.mood_level);
        });

        const weekdayAverages = {};
        Object.keys(weekdayMoods).forEach(day => {
            const moods = weekdayMoods[day];
            weekdayAverages[day] = moods.reduce((sum, mood) => sum + mood, 0) / moods.length;
        });

        const bestDay = Object.keys(weekdayAverages).reduce((a, b) => 
            weekdayAverages[a] > weekdayAverages[b] ? a : b
        );
        const worstDay = Object.keys(weekdayAverages).reduce((a, b) => 
            weekdayAverages[a] < weekdayAverages[b] ? a : b
        );

        return {
            average: Math.round(avgMood * 100) / 100,
            trend: trend > 0.05 ? 'improving' : trend < -0.05 ? 'declining' : 'stable',
            trend_slope: Math.round(trend * 10000) / 10000,
            volatility: Math.round(volatility * 100) / 100,
            best_weekday: bestDay,
            worst_weekday: worstDay,
            weekday_patterns: weekdayAverages
        };
    }

    // Simple linear regression for trend calculation
    calculateTrend(data) {
        const n = data.length;
        const sumX = data.reduce((sum, point) => sum + point.x, 0);
        const sumY = data.reduce((sum, point) => sum + point.y, 0);
        const sumXY = data.reduce((sum, point) => sum + (point.x * point.y), 0);
        const sumXX = data.reduce((sum, point) => sum + (point.x * point.x), 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        return slope;
    }

    // Analyze habit patterns
    analyzeHabitPatterns(habitData) {
        if (!habitData || habitData.length === 0) {
            return { completion_rate: 0, streaks: {}, patterns: {} };
        }

        // Group by habit name
        const habitGroups = {};
        habitData.forEach(entry => {
            if (!habitGroups[entry.name]) {
                habitGroups[entry.name] = [];
            }
            habitGroups[entry.name].push(entry);
        });

        const completionRates = {};
        const streaks = {};

        Object.keys(habitGroups).forEach(habitName => {
            const habits = habitGroups[habitName].sort((a, b) => a.date - b.date);
            
            // Calculate completion rate
            const completed = habits.filter(h => h.completed >= h.target).length;
            completionRates[habitName] = Math.round((completed / habits.length) * 1000) / 1000;

            // Calculate current streak
            let currentStreak = 0;
            for (let i = habits.length - 1; i >= 0; i--) {
                if (habits[i].completed >= habits[i].target) {
                    currentStreak++;
                } else {
                    break;
                }
            }
            streaks[habitName] = currentStreak;
        });

        // Overall completion rate
        const totalCompleted = habitData.reduce((sum, h) => sum + h.completed, 0);
        const totalTarget = habitData.reduce((sum, h) => sum + h.target, 0);
        const overallCompletion = totalTarget > 0 ? totalCompleted / totalTarget : 0;

        const mostConsistent = Object.keys(completionRates).reduce((a, b) => 
            completionRates[a] > completionRates[b] ? a : b
        );
        const needsAttention = Object.keys(completionRates).reduce((a, b) => 
            completionRates[a] < completionRates[b] ? a : b
        );

        return {
            overall_completion_rate: Math.round(overallCompletion * 1000) / 1000,
            individual_completion_rates: completionRates,
            current_streaks: streaks,
            most_consistent_habit: mostConsistent,
            needs_attention: needsAttention
        };
    }

    // Analyze study performance
    analyzeStudyPerformance(studyData) {
        if (!studyData || studyData.length === 0) {
            return { total_sessions: 0, avg_duration: 0, efficiency: 0 };
        }

        const totalSessions = studyData.length;
        const totalMinutes = studyData.reduce((sum, s) => sum + s.duration_minutes, 0);
        const avgDuration = totalMinutes / totalSessions;
        
        const completedSessions = studyData.filter(s => s.completed).length;
        const completionRate = completedSessions / totalSessions;

        // Hour analysis
        const hourlyData = {};
        studyData.forEach(session => {
            const hour = session.timestamp.getHours();
            if (!hourlyData[hour]) {
                hourlyData[hour] = { sessions: 0, completed: 0, totalDuration: 0 };
            }
            hourlyData[hour].sessions++;
            hourlyData[hour].totalDuration += session.duration_minutes;
            if (session.completed) hourlyData[hour].completed++;
        });

        let bestHour = null;
        let bestCompletionRate = 0;
        Object.keys(hourlyData).forEach(hour => {
            const data = hourlyData[hour];
            const rate = data.completed / data.sessions;
            if (rate > bestCompletionRate) {
                bestCompletionRate = rate;
                bestHour = parseInt(hour);
            }
        });

        // Subject analysis
        const subjectData = {};
        studyData.forEach(session => {
            if (!subjectData[session.subject]) {
                subjectData[session.subject] = { 
                    sessions: 0, 
                    totalDuration: 0, 
                    completed: 0 
                };
            }
            subjectData[session.subject].sessions++;
            subjectData[session.subject].totalDuration += session.duration_minutes;
            if (session.completed) subjectData[session.subject].completed++;
        });

        return {
            total_sessions: totalSessions,
            total_minutes: totalMinutes,
            avg_duration: Math.round(avgDuration * 10) / 10,
            completion_rate: Math.round(completionRate * 1000) / 1000,
            best_study_hour: bestHour,
            hourly_patterns: hourlyData,
            subject_performance: subjectData
        };
    }

    // Generate personalized recommendations
    generateRecommendations(insights) {
        const recommendations = [];

        // Mood recommendations
        if (insights.mood) {
            if (insights.mood.trend === 'declining') {
                recommendations.push(
                    "Your mood has been declining recently. Consider incorporating more mindfulness practices or reaching out for support."
                );
            }
            if (insights.mood.volatility > 1.5) {
                recommendations.push(
                    "Your mood shows high variability. Maintaining consistent sleep and exercise routines may help stabilize your emotional well-being."
                );
            }
        }

        // Habit recommendations
        if (insights.habits) {
            if (insights.habits.overall_completion_rate < 0.7) {
                recommendations.push(
                    "Your habit completion rate is below 70%. Consider reducing the number of habits or making them smaller and more achievable."
                );
            }
            if (insights.habits.needs_attention) {
                recommendations.push(
                    `Your '${insights.habits.needs_attention}' habit needs attention. Consider pairing it with an existing strong habit or adjusting the difficulty.`
                );
            }
        }

        // Study recommendations
        if (insights.study) {
            if (insights.study.best_study_hour && insights.study.completion_rate < 0.8) {
                recommendations.push(
                    `You perform best during ${insights.study.best_study_hour}:00. Try scheduling more important study sessions during this time.`
                );
            }
        }

        return recommendations;
    }

    // Create comprehensive wellness report
    async createWellnessReport(userId, days = 30) {
        try {
            // Load data
            const data = await this.loadUserData(userId, days);

            // Analyze each component
            const moodInsights = this.calculateMoodInsights(data.mood);
            const habitInsights = this.analyzeHabitPatterns(data.habits);
            const studyInsights = this.analyzeStudyPerformance(data.study);

            // Combine all insights
            const allInsights = {
                mood: moodInsights,
                habits: habitInsights,
                study: studyInsights
            };

            // Generate recommendations
            const recommendations = this.generateRecommendations(allInsights);

            // Create final report
            const report = {
                user_id: userId,
                analysis_period: {
                    days: days,
                    start_date: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    end_date: new Date().toISOString().split('T')[0]
                },
                insights: allInsights,
                recommendations: recommendations,
                generated_at: new Date().toISOString(),
                data_quality: {
                    mood_entries: data.mood.length,
                    habit_entries: data.habits.length,
                    study_entries: data.study.length,
                    period_entries: data.period.length
                }
            };

            return report;

        } catch (error) {
            console.error('Error generating wellness report:', error);
            throw error;
        }
    }

    // Export report to JSON file
    async exportReportJSON(report, outputPath = null) {
        if (!outputPath) {
            outputPath = `wellness_report_${report.user_id}_${new Date().toISOString().split('T')[0]}.json`;
        }

        try {
            await fs.writeFile(outputPath, JSON.stringify(report, null, 2));
            console.log(`Wellness report exported to: ${outputPath}`);
            return outputPath;
        } catch (error) {
            console.error('Error exporting report:', error);
            throw error;
        }
    }

    // Export report to CSV format
    async exportReportCSV(report, outputPath = null) {
        if (!outputPath) {
            outputPath = `wellness_report_${report.user_id}_${new Date().toISOString().split('T')[0]}.csv`;
        }

        const rows = [];
        
        // Add header
        rows.push('metric,value,category');

        // Add insights
        if (report.insights.mood) {
            rows.push(`mood_average,${report.insights.mood.average},mood`);
            rows.push(`mood_trend,${report.insights.mood.trend},mood`);
            rows.push(`mood_volatility,${report.insights.mood.volatility},mood`);
        }

        if (report.insights.habits) {
            rows.push(`habit_completion_rate,${report.insights.habits.overall_completion_rate},habits`);
            rows.push(`most_consistent_habit,${report.insights.habits.most_consistent_habit},habits`);
        }

        if (report.insights.study) {
            rows.push(`study_completion_rate,${report.insights.study.completion_rate},study`);
            rows.push(`avg_study_duration,${report.insights.study.avg_duration},study`);
            rows.push(`best_study_hour,${report.insights.study.best_study_hour},study`);
        }

        // Add recommendations
        report.recommendations.forEach((rec, index) => {
            rows.push(`recommendation_${index + 1},"${rec}",recommendations`);
        });

        const csvContent = rows.join('\n');

        try {
            await fs.writeFile(outputPath, csvContent);
            console.log(`Wellness report exported to: ${outputPath}`);
            return outputPath;
        } catch (error) {
            console.error('Error exporting CSV:', error);
            throw error;
        }
    }
}

// Main function for testing
async function main() {
    const analyzer = new WellnessAnalyzer();
    
    try {
        console.log('=== BloomWell Wellness Report (JavaScript) ===');
        
        // Generate report for test user
        const testUserId = "test_user_1";
        const report = await analyzer.createWellnessReport(testUserId, 30);
        
        // Print summary
        console.log(`User: ${report.user_id}`);
        console.log(`Period: ${report.analysis_period.start_date} to ${report.analysis_period.end_date}`);
        console.log(`Data Quality:`, report.data_quality);
        
        if (report.insights.mood) {
            console.log(`\nMood Average: ${report.insights.mood.average}`);
            console.log(`Mood Trend: ${report.insights.mood.trend}`);
        }
        
        if (report.insights.habits) {
            console.log(`Habit Completion Rate: ${(report.insights.habits.overall_completion_rate * 100).toFixed(1)}%`);
        }
        
        console.log('\nRecommendations:');
        report.recommendations.forEach(rec => {
            console.log(`- ${rec}`);
        });
        
        // Export to files
        const jsonPath = await analyzer.exportReportJSON(report);
        const csvPath = await analyzer.exportReportCSV(report);
        
        console.log(`\nReports exported:`);
        console.log(`JSON: ${jsonPath}`);
        console.log(`CSV: ${csvPath}`);
        
    } catch (error) {
        console.error('Error in main execution:', error);
    }
}

// Export for use in other modules
module.exports = WellnessAnalyzer;

// Run main if this file is executed directly
if (require.main === module) {
    main();
}
const WellnessAnalyzer = require('./analytics');

// In your server routes:
app.get('/api/analytics/:userId', async (req, res) => {
    const analyzer = new WellnessAnalyzer();
    const report = await analyzer.createWellnessReport(req.params.userId);
    res.json(report);
});
