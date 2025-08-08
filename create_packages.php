<?php
/**
 * Script to create attractive travel packages for Island Trails website
 * This will add beautiful Sri Lankan travel packages to showcase the admin functionality
 */

require_once 'src/database/connection.php';

// Array of attractive travel packages
$packages = [
    [
        'title' => 'Golden Temple & Cultural Heritage Tour',
        'description' => 'Explore ancient Buddhist temples, UNESCO World Heritage sites including Sigiriya Rock Fortress and Dambulla Cave Temple. Experience traditional Sri Lankan culture, local cuisine, and witness spectacular sunset views from ancient kingdoms. Perfect for history enthusiasts and spiritual seekers.',
        'price' => 299.99,
        'duration' => '5 days, 4 nights',
        'image_url' => 'https://images.unsplash.com/photo-1584732477249-e0cb01fc6ba7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'category' => 'cultural'
    ],
    [
        'title' => 'Tropical Paradise Beach Escape',
        'description' => 'Relax on pristine white sand beaches of Mirissa and Unawatuna. Enjoy whale watching, snorkeling in crystal-clear waters, beachside dining with fresh seafood, and stunning ocean sunsets. Includes luxury beachfront accommodation and spa treatments.',
        'price' => 449.99,
        'duration' => '7 days, 6 nights',
        'image_url' => 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'category' => 'beach'
    ],
    [
        'title' => 'Highland Tea Plantation Adventure',
        'description' => 'Journey through misty mountains of Nuwara Eliya and Ella. Visit world-famous tea estates, ride the scenic train through Nine Arch Bridge, hike to World\'s End cliff, and experience cool mountain climate. Includes tea tasting sessions and plantation tours.',
        'price' => 359.99,
        'duration' => '4 days, 3 nights',
        'image_url' => 'https://images.unsplash.com/photo-1564518047129-3bd58b70cd1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'category' => 'nature'
    ],
    [
        'title' => 'Wild Safari & Elephant Sanctuary',
        'description' => 'Experience incredible wildlife at Yala National Park with leopard spotting, elephant herds, and exotic birds. Visit Pinnawala Elephant Orphanage, enjoy jungle camping, and nature walks. Perfect for wildlife photographers and nature lovers seeking authentic safari experiences.',
        'price' => 389.99,
        'duration' => '6 days, 5 nights',
        'image_url' => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'category' => 'adventure'
    ],
    [
        'title' => 'Colombo City & Coastal Discovery',
        'description' => 'Explore vibrant Colombo city with modern shopping, colonial architecture, and bustling markets. Visit Galle Fort, enjoy coastal train rides, experience street food tours, and discover the perfect blend of urban excitement and coastal charm.',
        'price' => 229.99,
        'duration' => '3 days, 2 nights',
        'image_url' => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'category' => 'cultural'
    ],
    [
        'title' => 'Extreme Adventure & Adrenaline Rush',
        'description' => 'Thrilling white-water rafting in Kitulgala, rock climbing, zip-lining through rainforests, and waterfall rappelling. Perfect for adrenaline junkies seeking heart-pumping adventures in Sri Lanka\'s most scenic locations. Includes professional guides and safety equipment.',
        'price' => 479.99,
        'duration' => '5 days, 4 nights',
        'image_url' => 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'category' => 'adventure'
    ],
    [
        'title' => 'Romantic Honeymoon Getaway',
        'description' => 'Luxurious romantic escape with private beach dinners, couple spa treatments, sunset boat rides, and intimate moments in paradise. Stay in premium resorts with ocean views, enjoy champagne breakfasts, and create unforgettable memories together.',
        'price' => 699.99,
        'duration' => '8 days, 7 nights',
        'image_url' => 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'category' => 'beach'
    ],
    [
        'title' => 'Spiritual Meditation Retreat',
        'description' => 'Find inner peace through guided meditation sessions, yoga classes, and spiritual teachings in serene temple environments. Experience authentic Buddhist practices, mindfulness workshops, and healthy vegetarian cuisine. Perfect for spiritual growth and mental wellness.',
        'price' => 319.99,
        'duration' => '7 days, 6 nights',
        'image_url' => 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'category' => 'cultural'
    ],
    [
        'title' => 'Photography Expedition Tour',
        'description' => 'Capture stunning landscapes, wildlife, and cultural moments with professional photography guidance. Visit the most photogenic locations including sunrise at Adam\'s Peak, leopards in Yala, and traditional village life. Includes photo editing workshops.',
        'price' => 529.99,
        'duration' => '10 days, 9 nights',
        'image_url' => 'https://images.unsplash.com/photo-1502780402662-acc01917bf59?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'category' => 'adventure'
    ],
    [
        'title' => 'Family Fun & Educational Tour',
        'description' => 'Perfect family adventure with kid-friendly activities, educational temple visits, gentle elephant encounters, beach fun, and cultural shows. Includes family-friendly accommodations, local cooking classes, and unforgettable experiences for all ages.',
        'price' => 399.99,
        'duration' => '6 days, 5 nights',
        'image_url' => 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'category' => 'cultural'
    ],
    [
        'title' => 'Surfing & Water Sports Paradise',
        'description' => 'Ride the perfect waves at Arugam Bay and Hikkaduwa with professional surf lessons, stand-up paddleboarding, jet skiing, and deep-sea fishing. Includes surfboard rental, beachfront accommodation, and vibrant nightlife experiences.',
        'price' => 369.99,
        'duration' => '5 days, 4 nights',
        'image_url' => 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'category' => 'beach'
    ],
    [
        'title' => 'Luxury Wellness & Spa Retreat',
        'description' => 'Rejuvenate your mind and body with traditional Ayurvedic treatments, luxury spa therapies, yoga sessions, and organic healthy cuisine. Stay in premium wellness resorts with tranquil environments and professional wellness consultations.',
        'price' => 799.99,
        'duration' => '9 days, 8 nights',
        'image_url' => 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'category' => 'nature'
    ]
];

try {
    $conn = DatabaseConnection::getConnection();
    
    // Check if packages table exists and has data
    $checkSql = "SELECT COUNT(*) as count FROM packages";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->execute();
    $existingCount = $checkStmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    echo "Current packages in database: $existingCount\n\n";
    
    $successCount = 0;
    $errorCount = 0;
    
    foreach ($packages as $index => $package) {
        try {
            // Check if package with similar title already exists
            $duplicateCheckSql = "SELECT COUNT(*) as count FROM packages WHERE title = :title";
            $duplicateStmt = $conn->prepare($duplicateCheckSql);
            $duplicateStmt->bindParam(':title', $package['title']);
            $duplicateStmt->execute();
            $duplicateExists = $duplicateStmt->fetch(PDO::FETCH_ASSOC)['count'] > 0;
            
            if ($duplicateExists) {
                echo "⚠️  Package '" . $package['title'] . "' already exists, skipping...\n";
                continue;
            }
            
            // Insert package
            $sql = "INSERT INTO packages (title, description, price, duration, image_url) 
                    VALUES (:title, :description, :price, :duration, :image_url)";
            
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':title', $package['title']);
            $stmt->bindParam(':description', $package['description']);
            $stmt->bindParam(':price', $package['price']);
            $stmt->bindParam(':duration', $package['duration']);
            $stmt->bindParam(':image_url', $package['image_url']);
            
            if ($stmt->execute()) {
                $packageId = $conn->lastInsertId();
                echo "✅ Created: '{$package['title']}' (ID: $packageId) - \${$package['price']}\n";
                $successCount++;
            } else {
                echo "❌ Failed to create: '{$package['title']}'\n";
                $errorCount++;
            }
            
        } catch (PDOException $e) {
            echo "❌ Error creating '{$package['title']}': " . $e->getMessage() . "\n";
            $errorCount++;
        }
    }
    
    echo "\n" . str_repeat("=", 60) . "\n";
    echo "📊 PACKAGE CREATION SUMMARY:\n";
    echo "✅ Successfully created: $successCount packages\n";
    echo "❌ Errors: $errorCount\n";
    echo "📦 Total packages now in database: " . ($existingCount + $successCount) . "\n\n";
    
    if ($successCount > 0) {
        echo "🎉 SUCCESS! Your Island Trails website now has beautiful packages!\n\n";
        echo "🌐 How to view them:\n";
        echo "1. Go to: http://localhost/WAD/island-trails/frontend/\n";
        echo "2. Click 'Packages' in the navigation menu\n";
        echo "3. Browse the attractive travel packages\n\n";
        
        echo "🛡️ Admin Management:\n";
        echo "1. Login as admin (admin@example.com / admin123)\n";
        echo "2. Click 'Admin' in navigation\n";
        echo "3. Go to 'Packages' tab to manage all packages\n";
        echo "4. You can edit, delete, or add more packages\n\n";
        
        echo "🎯 Package Categories Created:\n";
        $categories = array_count_values(array_column($packages, 'category'));
        foreach ($categories as $category => $count) {
            echo "   • " . ucfirst($category) . ": $count packages\n";
        }
        
        echo "\n🏷️ Price Range: \$" . number_format(min(array_column($packages, 'price')), 2) . 
             " - \$" . number_format(max(array_column($packages, 'price')), 2) . "\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Database connection error: " . $e->getMessage() . "\n";
} catch (Exception $e) {
    echo "❌ General error: " . $e->getMessage() . "\n";
}
?>
