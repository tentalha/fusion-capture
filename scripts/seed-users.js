/**
 * Seed Script - Create Demo Users
 * 
 * Usage: node scripts/seed-users.js
 * 
 * This script helps create demo users with different roles.
 * Run this after signing in at least once to populate the database.
 */

const mongoose = require('mongoose');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  try {
    // Get MongoDB URI
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fusion-capture';
    
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Define User schema (same as in the app)
    const UserSchema = new mongoose.Schema({
      name: String,
      email: String,
      image: String,
      role: {
        type: String,
        enum: ['admin', 'editor', 'viewer'],
        default: 'viewer',
      },
      permissions: [String],
      accounts: [{
        provider: String,
        providerAccountId: String,
      }],
    }, {
      timestamps: true,
    });

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    // Get all users
    const users = await User.find({});
    
    if (users.length === 0) {
      console.log('⚠️  No users found in database.');
      console.log('   Please sign in at least once before running this script.\n');
      process.exit(0);
    }

    console.log('📋 Current Users:\n');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Providers: ${user.accounts.map(a => a.provider).join(', ')}\n`);
    });

    console.log('You can update user roles here:\n');
    
    const email = await question('Enter user email to update: ');
    const user = users.find(u => u.email === email);

    if (!user) {
      console.log('❌ User not found');
      rl.close();
      process.exit(1);
    }

    console.log('\nSelect new role:');
    console.log('1. Admin');
    console.log('2. Editor');
    console.log('3. Viewer');
    
    const roleChoice = await question('\nEnter choice (1-3): ');
    
    const roles = { '1': 'admin', '2': 'editor', '3': 'viewer' };
    const newRole = roles[roleChoice];

    if (!newRole) {
      console.log('❌ Invalid choice');
      rl.close();
      process.exit(1);
    }

    // Update user role
    user.role = newRole;
    
    // Update permissions based on role
    switch (newRole) {
      case 'admin':
        user.permissions = [
          'read:all',
          'write:all',
          'delete:all',
          'manage:users',
          'view:analytics',
          'approve:content',
        ];
        break;
      case 'editor':
        user.permissions = [
          'read:all',
          'write:own',
          'write:content',
          'approve:content',
        ];
        break;
      case 'viewer':
        user.permissions = ['read:all'];
        break;
    }

    await user.save();

    console.log(`\n✅ Updated ${email} to ${newRole} role`);
    console.log(`   Permissions: ${user.permissions.join(', ')}`);
    console.log('\n💡 Please sign out and sign back in for changes to take effect.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
    mongoose.connection.close();
  }
}

main();
