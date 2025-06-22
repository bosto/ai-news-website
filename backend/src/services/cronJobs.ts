import { CronJob } from 'cron';
import { NewsAggregator } from './newsAggregator';

export class CronJobs {
  private newsAggregator: NewsAggregator;

  constructor() {
    this.newsAggregator = new NewsAggregator();
  }

  start(): void {
    console.log('Starting cron jobs...');

    // Run news aggregation every 4 hours
    const newsAggregationJob = new CronJob(
      '0 */4 * * *', // Every 4 hours
      async () => {
        console.log('Running scheduled news aggregation...');
        try {
          await this.newsAggregator.aggregateNews();
          console.log('Scheduled news aggregation completed');
        } catch (error) {
          console.error('Error in scheduled news aggregation:', error);
        }
      },
      null,
      true,
      'UTC'
    );

    // Daily cleanup job - runs at 2 AM UTC
    const cleanupJob = new CronJob(
      '0 2 * * *', // Daily at 2 AM UTC
      async () => {
        console.log('Running daily cleanup...');
        try {
          await this.runCleanup();
          console.log('Daily cleanup completed');
        } catch (error) {
          console.error('Error in daily cleanup:', error);
        }
      },
      null,
      true,
      'UTC'
    );

    console.log('Cron jobs started successfully');
  }

  private async runCleanup(): Promise<void> {
    // Add cleanup logic here
    // For example: remove old processed external articles, clear cache, etc.
    console.log('Cleanup tasks completed');
  }

  // Manual trigger for news aggregation (for testing/admin use)
  async triggerNewsAggregation(): Promise<void> {
    console.log('Manually triggering news aggregation...');
    await this.newsAggregator.aggregateNews();
  }
}

export const cronJobs = new CronJobs();