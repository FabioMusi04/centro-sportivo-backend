import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'courses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.string('title')
      table.text('description')
      table.integer('max_participants')
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.boolean('is_active').defaultTo(true)
      table.string('location').nullable()
      table.boolean('is_online').defaultTo(false)
      table.string('category').nullable()
      table.timestamp('start_date', { useTz: true })
      table.timestamp('end_date', { useTz: true })

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
