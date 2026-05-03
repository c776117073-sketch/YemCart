#!/usr/bin/env node

/**
 * YemCart Database Deployment Script
 * Deploys the database schema from schema.sql to Supabase
 * 
 * Usage: node deploy-db.js
 * 
 * Requirements:
 * - .env.local file with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * - @supabase/supabase-js installed
 */

import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate environment variables
if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Error: Missing environment variables!')
  console.error('Make sure your .env.local file contains:')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  console.error('  - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Create Supabase client with service role key (for admin operations)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

/**
 * Split SQL file into statements
 * Handles multi-line statements and comments
 */
function parseSQLStatements(sqlContent) {
  // Remove comments (both -- and /* */ style)
  let cleaned = sqlContent.replace(/--[^\n]*\n/g, '\n')
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '')

  // Split by semicolon and filter empty statements
  const statements = cleaned
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0)

  return statements
}

/**
 * Execute SQL statements
 */
async function executeSQLStatements(statements) {
  let successCount = 0
  let failureCount = 0
  const errors = []

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i]
    const statementNumber = i + 1

    try {
      console.log(`[${statementNumber}/${statements.length}] Executing statement...`)

      const { data, error } = await supabase.rpc('exec_sql', {
        sql: statement,
      })

      if (error) {
        throw error
      }

      successCount++
      console.log(`✅ Statement ${statementNumber} executed successfully`)
    } catch (error) {
      failureCount++
      const errorMessage = error.message || String(error)
      errors.push({
        statement: statementNumber,
        error: errorMessage,
        sql: statement.substring(0, 100) + (statement.length > 100 ? '...' : ''),
      })
      console.error(`❌ Statement ${statementNumber} failed: ${errorMessage}`)
    }
  }

  return { successCount, failureCount, errors }
}

/**
 * Alternative: Execute SQL using SQL connection (if exec_sql RPC doesn't exist)
 * This requires having the sql.sql function or using direct query execution
 */
async function executeSQL(sqlContent) {
  try {
    console.log('Attempting direct SQL execution...')

    const { data, error } = await supabase.rpc('exec', {
      sql_string: sqlContent,
    })

    if (error) {
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('Direct SQL execution failed:', error.message)
    return { success: false, error }
  }
}

/**
 * Main deployment function
 */
async function deployDatabase() {
  console.log('🚀 YemCart Database Deployment')
  console.log('================================\n')

  try {
    // Read schema.sql file
    const schemaPath = path.join(process.cwd(), 'schema.sql')

    if (!fs.existsSync(schemaPath)) {
      console.error('❌ Error: schema.sql file not found!')
      console.error(`Expected path: ${schemaPath}`)
      process.exit(1)
    }

    console.log('📖 Reading schema.sql...')
    const sqlContent = fs.readFileSync(schemaPath, 'utf-8')
    console.log(`✅ Schema.sql read successfully (${sqlContent.length} bytes)\n`)

    // Parse SQL statements
    console.log('🔍 Parsing SQL statements...')
    const statements = parseSQLStatements(sqlContent)
    console.log(`✅ Found ${statements.length} SQL statements\n`)

    // Execute statements
    console.log('⚙️  Executing statements...\n')

    // Try method 1: Using individual prepared statements
    // This is more reliable as it doesn't require an exec_sql function
    let allSuccess = true

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      const statementNumber = i + 1

      try {
        console.log(`[${statementNumber}/${statements.length}] ${statement.substring(0, 60)}...`)

        // Use query method to execute raw SQL
        const { data, error } = await supabase.rpc('exec_sql_query', {
          query: statement,
        })

        if (error) {
          // If exec_sql_query doesn't exist, try direct sql execution
          // For this, you need to have a custom SQL function set up
          throw new Error(
            `Statement execution failed. Make sure you have set up a custom SQL function in Supabase dashboard.`
          )
        }

        console.log(`✅ Statement ${statementNumber} executed`)
      } catch (error) {
        console.error(
          `❌ Statement ${statementNumber} failed: ${error.message}`
        )
        allSuccess = false

        // Continue with next statement to see all errors
      }
    }

    if (allSuccess) {
      console.log('\n✨ Database deployment completed successfully!')
      process.exit(0)
    } else {
      console.log(
        '\n⚠️  Some statements failed. Please check the errors above.'
      )
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Fatal error during deployment:')
    console.error(error.message)
    process.exit(1)
  }
}

// Run deployment
deployDatabase()
