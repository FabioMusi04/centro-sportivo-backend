import { BaseCommand } from '@adonisjs/core/build/standalone'
import { Status } from 'App/Models/Booking'
import { DateTime } from 'luxon'

export default class CleanOldBookings extends BaseCommand {
  public static needsApplication = true

  /**
   * Command name is used to run the command
   */
  public static commandName = 'clean:old_bookings'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = ''

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest` 
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call 
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  public async run() {
    const { default: Booking } = await import('App/Models/Booking')

    this.logger.info('Cleaning old bookings...')

    const thirtyDaysAgo = DateTime.now().minus({ days: 30 }).toISO();

    await Booking.query()
      .where('status', Status.CANCELLED)
      .where('cancelled_at', '<', thirtyDaysAgo)
      .delete();

    this.logger.success('Old bookings cleaned successfully.')
  }
}
