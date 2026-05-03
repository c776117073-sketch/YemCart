#!/usr/bin/env node

/**
 * YemCart Database Deployment Script - Alternative Version
 * المسار الموصى به: قم بتشغيل schema.sql مباشرة في Supabase SQL Editor ثم شغل هذا السكريبت
 * 
 * لكن هذه النسخة تحاول نشر البيانات الافتراضية والتحقق من نجاح النشر
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing environment variables in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function verifyDatabaseSchema() {
  console.log('🔍 Verifying database schema...\n')

  const tablesToCheck = [
    'users',
    'stores',
    'products',
    'product_images',
    'shipping_zones',
    'orders',
    'order_items',
    'messages',
  ]

  let allTablesExist = true

  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase.from(table).select('*', { count: 'exact' }).limit(0)

      if (error) {
        console.log(`❌ Table '${table}' does not exist`)
        allTablesExist = false
      } else {
        console.log(`✅ Table '${table}' exists`)
      }
    } catch (error) {
      console.log(`❌ Error checking table '${table}': ${error.message}`)
      allTablesExist = false
    }
  }

  return allTablesExist
}

async function setupDefaultShippingZones() {
  console.log('\n📍 Setting up default shipping zones for Yemen...\n')

  try {
    // Get all stores
    const { data: stores, error: storesError } = await supabase
      .from('stores')
      .select('id')
      .limit(1)

    if (storesError || !stores || stores.length === 0) {
      console.log('⚠️  No stores found. Skipping default shipping zones setup.')
      return
    }

    const defaultYemenCities = [
      { city: 'صنعاء', fee: 1000 },
      { city: 'عدن', fee: 1500 },
      { city: 'تعز', fee: 1200 },
      { city: 'إب', fee: 500 },
      { city: 'المكلا', fee: 2000 },
      { city: 'حضرموت', fee: 1800 },
      { city: 'ذمار', fee: 800 },
      { city: 'إب', fee: 900 },
    ]

    for (const store of stores) {
      for (const city of defaultYemenCities) {
        const { error: insertError } = await supabase.from('shipping_zones').insert([
          {
            store_id: store.id,
            city_name: city.city,
            delivery_fee: city.fee,
          },
        ])

        if (!insertError) {
          console.log(`✅ Added shipping zone: ${city.city} (${city.fee} ر.ي)`)
        }
      }
    }
  } catch (error) {
    console.error('❌ Error setting up shipping zones:', error.message)
  }
}

async function testDatabaseConnection() {
  console.log('🧪 Testing database connection...\n')

  try {
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      console.log('⚠️  Auth check: ' + error.message)
    } else {
      console.log('✅ Successfully connected to Supabase')
    }
  } catch (error) {
    console.error('❌ Connection error:', error.message)
    return false
  }

  return true
}

async function main() {
  console.log('🚀 YemCart Database Setup Verification')
  console.log('=====================================\n')

  const connected = await testDatabaseConnection()

  if (!connected) {
    console.error('\n❌ Failed to connect to Supabase')
    process.exit(1)
  }

  const schemaExists = await verifyDatabaseSchema()

  if (!schemaExists) {
    console.error('\n❌ Database schema is incomplete!')
    console.error('\n📝 Steps to complete setup:')
    console.error('1. Open your Supabase project dashboard')
    console.error('2. Go to SQL Editor')
    console.error('3. Click "New Query"')
    console.error('4. Copy the entire content of schema.sql')
    console.error('5. Paste it in the SQL editor')
    console.error('6. Click "Run"')
    console.error('7. Then run this script again: node deploy-db-verify.js')
    process.exit(1)
  }

  await setupDefaultShippingZones()

  console.log('\n✨ Database setup completed successfully!')
  console.log('\n📋 Next steps:')
  console.log('1. Create a .env.local file with:')
  console.log('   NEXT_PUBLIC_SUPABASE_URL=your_url')
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key')
  console.log('   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key')
  console.log('2. Run: npm install')
  console.log('3. Run: npm run dev')
}

main().catch(console.error)
