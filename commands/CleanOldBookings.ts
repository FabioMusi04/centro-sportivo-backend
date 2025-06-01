import { BaseCommand } from '@adonisjs/core/build/standalone'
import Booking from 'App/Models/Booking'

export default class CleanOldBookings extends BaseCommand {
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
    loadApp: false,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call 
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  public async run() {
    this.logger.info('Cleaning old bookings...')

    await Booking.query()
      .where('returned', true)
      .delete()

    this.logger.success('Old bookings cleaned successfully.')
  }
}
