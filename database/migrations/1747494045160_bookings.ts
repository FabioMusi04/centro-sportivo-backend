import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'bookings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table
        .integer('course_id')
        .unsigned()
        .references('id')
        .inTable('courses')
        .onDelete('CASCADE')

      table.timestamp('booking_date')

      table
        .enum('status', ['pending', 'confirmed', 'cancelled'])
        .notNullable()
        .defaultTo('pending')

      table.timestamp('cancelled_at', { useTz: true }).nullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
