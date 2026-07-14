<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tofunmi EIRA - Emotion & Intent Recognition Assistant</title>
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <div class="app-container">
        <!-- Header -->
        <header class="app-header">
            <div class="logo">
                <h1>Tofunmi EIRA</h1>
            </div>
            <div class="status-indicator" id="system-status">Initializing...</div>
        </header>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Video Section -->
            <div class="video-container panel">
                <video id="webcam" autoplay muted playsinline></video>
                <canvas id="overlay"></canvas>
                <div class="video-overlay-text">Live Analysis</div>
            </div>

            <!-- Dashboard Section -->
            <div class="dashboard-container">

                <!-- Emotion Panel -->
                <div class="dashboard-card panel emotion-card">
                    <h2>Current Emotion</h2>
                    <div class="emotion-display" id="emotion-display">
                        <span class="emoji">😐</span>
                        <span class="label">Neutral</span>
                    </div>
                </div>

                <!-- Intent Panel -->
                <div class="dashboard-card panel intent-card">
                    <h2>Estimated Intent</h2>
                    <div class="intent-display" id="intent-display">
                        <span class="intent-text">Waiting for speech...</span>
                    </div>
                </div>

                <!-- Transcript Panel -->
                <div class="dashboard-card panel transcript-card">
                    <h2>Live Transcript</h2>
                    <div class="transcript-box" id="transcript-box">
                        <p class="placeholder-text">Listening...</p>
                    </div>
                </div>

            </div>
        </main>
    </div>
    <?php wp_footer(); ?>
</body>
</html>
