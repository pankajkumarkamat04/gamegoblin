/**
 * Example Order Flow Component
 * 
 * This demonstrates the complete TWO-STEP order process:
 * 1. User selects game & package
 * 2. User enters player details (game-specific)
 * 3. [OPTIONAL] Verify player (MLBB only)
 * 4. Create order (validates, reserves - NO COST)
 * 5. User pays via payment gateway
 * 6. Payment webhook triggers order processing automatically (calls reseller API)
 * 7. Frontend polls order status using getOrder() to show completion
 * 
 * NOTE: Step 6 happens server-side via webhook. Frontend should NOT call
 * process endpoint directly for security reasons.
 */

'use client';

import { useState } from 'react';
import {
  getGames,
  getGamePackages,
  verifyMLBBPlayer,
  createOrder,
  getOrder,
  type Game,
  type GamePackage,
  type Order,
} from '@/lib/api';
import { getPlayerRequirements, validatePlayerDetails } from '@/lib/player-details';

export default function ExampleOrderFlow() {
  const [step, setStep] = useState<'select-game' | 'select-package' | 'player-details' | 'payment' | 'complete'>('select-game');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [packages, setPackages] = useState<GamePackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<GamePackage | null>(null);
  const [playerDetails, setPlayerDetails] = useState({
    playerId: '',
    zoneId: '',
    server: '',
    playerName: '',
  });
  const [order, setOrder] = useState<Order | null>(null);

  // Auto-parse player ID format: "750408293 (8985)" -> Player ID: 750408293, Zone ID: 8985
  const handlePlayerIdChange = (value: string, requirements: any) => {
    const pastePattern = /^(\d+)\s*\((\d+)\)$/;
    const match = value.match(pastePattern);
    
    if (match && requirements.zoneId) {
      // Auto-parse detected (silent) - only if game requires zoneId
      const [, playerId, zone] = match;
      setPlayerDetails({
        ...playerDetails,
        playerId: playerId,
        zoneId: zone,
      });
    } else {
      // Normal input
      setPlayerDetails({ ...playerDetails, playerId: value });
    }
  };

  // STEP 1: Load games
  const loadGames = async () => {
    setLoading(true);
    setError('');
    try {
      const gamesList = await getGames();
      setGames(gamesList);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Load packages for selected game
  const selectGame = async (game: Game) => {
    setSelectedGame(game);
    setLoading(true);
    setError('');
    try {
      const packagesList = await getGamePackages(game.slug);
      setPackages(packagesList);
      setStep('select-package');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Select package
  const selectPackage = (pkg: GamePackage) => {
    setSelectedPackage(pkg);
    setStep('player-details');
  };

  // STEP 4: Verify player (MLBB only)
  const verifyPlayer = async () => {
    if (selectedGame?.slug !== 'mobile-legends') return;

    setLoading(true);
    setError('');
    try {
      const result = await verifyMLBBPlayer(
        playerDetails.playerId,
        playerDetails.zoneId
      );

      if (result.success && result.data) {
        setPlayerDetails({
          ...playerDetails,
          playerName: result.data.username || '',
        });
        alert(`Player verified: ${result.data.username}`);
      } else {
        setError(result.message || 'Player verification failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // STEP 5: Create order (NO reseller API call yet!)
  const handleCreateOrder = async () => {
    if (!selectedGame || !selectedPackage) return;

    // Validate player details
    const validation = validatePlayerDetails(selectedGame.slug, playerDetails);
    if (!validation.valid) {
      setError(validation.errors.join(', '));
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await createOrder({
        gameSlug: selectedGame.slug,
        packageId: selectedPackage.id,
        playerDetails: {
          playerId: playerDetails.playerId,
          zoneId: playerDetails.zoneId || undefined,
          server: playerDetails.server || undefined,
          playerName: playerDetails.playerName || undefined,
        },
        customerPhone: '6281500000000', // Get from user
      });

      if (result.success && result.order) {
        setOrder(result.order);
        console.log('✅ Order created:', result.order.orderNumber);
        console.log('💰 Status:', result.order.status); // Will be "pending"
        console.log('📦 Reseller Order ID:', result.order.resellerOrderId); // Will be null
        setStep('payment');
      } else {
        setError(result.message || 'Failed to create order');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // STEP 6: Payment (integrate with Razorpay/Stripe here)
  const handlePayment = async () => {
    if (!order) return;

    // TODO: Integrate payment gateway here
    // For now, simulate successful payment
    alert(`Payment gateway integration goes here.\nAmount: ₹${order.totalPrice}`);

    // After payment confirmed, order processing happens automatically via webhook
    // Frontend should poll order status using getOrder()
    setStep('complete');
    alert('Order processing is triggered automatically by payment webhook.\nUse getOrder() to check status.');
  };

  // STEP 7: Check order status (order processing happens via webhook)
  const checkOrderStatus = async () => {
    if (!order) return;

    setLoading(true);
    setError('');
    try {
      const result = await getOrder(order._id);

      if (result.success && result.order) {
        setOrder(result.order);
        console.log('✅ Order status:', result.order.status);
        console.log('💰 Payment:', result.order.paymentStatus);
        console.log('🎮 Reseller Order ID:', result.order.resellerOrderId);
      } else {
        setError(result.message || 'Failed to fetch order');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // STEP 8: Poll for order completion (removed old checkOrderStatus)
  const pollOrderStatus = async () => {
    if (!order) return;

    setLoading(true);
    try {
      const result = await getOrder(order._id);
      if (result.success && result.order) {
        setOrder(result.order);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Order Flow Example</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* STEP 1: Select Game */}
      {step === 'select-game' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Step 1: Select Game</h2>
          <button
            onClick={loadGames}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {loading ? 'Loading...' : 'Load Games'}
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {games.map((game) => (
              <div
                key={game._id}
                onClick={() => selectGame(game)}
                className="border rounded p-4 cursor-pointer hover:border-blue-500"
              >
                <h3 className="font-bold">{game.name}</h3>
                <p className="text-sm text-gray-600">{game.slug}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Select Package */}
      {step === 'select-package' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Step 2: Select Package</h2>
          <p>Game: <strong>{selectedGame?.name}</strong></p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => selectPackage(pkg)}
                className="border rounded p-4 cursor-pointer hover:border-blue-500"
              >
                <h3 className="font-bold">{pkg.name}</h3>
                <p className="text-lg text-blue-600">₹{pkg.price}</p>
                <p className="text-sm text-gray-600">{pkg.reseller}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: Player Details */}
      {step === 'player-details' && selectedGame && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Step 3: Enter Player Details</h2>
          <p>Package: <strong>{selectedPackage?.name}</strong></p>

          {(() => {
            const requirements = getPlayerRequirements(selectedGame.slug);
            return (
              <>
                {/* Player ID */}
                <div>
                  <label className="block font-medium mb-2">
                    {requirements.playerId.label} *
                  </label>
                  <input
                    type={requirements.playerId.type}
                    placeholder={requirements.playerId.placeholder}
                    value={playerDetails.playerId}
                    onChange={(e) => handlePlayerIdChange(e.target.value, requirements)}
                    className="w-full px-4 py-2 border rounded"
                  />
                </div>

                {/* Zone ID (MLBB, Honor of Kings) */}
                {requirements.zoneId && (
                  <div>
                    <label className="block font-medium mb-2">
                      {requirements.zoneId.label} *
                    </label>
                    <input
                      type={requirements.zoneId.type}
                      placeholder={requirements.zoneId.placeholder}
                      value={playerDetails.zoneId}
                      onChange={(e) =>
                        setPlayerDetails({ ...playerDetails, zoneId: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded"
                    />
                  </div>
                )}

                {/* Server (Genshin) */}
                {requirements.server && (
                  <div>
                    <label className="block font-medium mb-2">
                      {requirements.server.label} *
                    </label>
                    <select
                      value={playerDetails.server}
                      onChange={(e) =>
                        setPlayerDetails({ ...playerDetails, server: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded"
                    >
                      <option value="">Select Server</option>
                      {requirements.server.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Verify Button (MLBB only) */}
                {requirements.hasVerification && (
                  <button
                    onClick={verifyPlayer}
                    disabled={loading}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    {loading ? 'Verifying...' : 'Verify Player'}
                  </button>
                )}

                {playerDetails.playerName && (
                  <p className="text-green-600">✓ Player: {playerDetails.playerName}</p>
                )}
              </>
            );
          })()}

          <button
            onClick={handleCreateOrder}
            disabled={loading}
            className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
          >
            {loading ? 'Creating Order...' : 'Create Order'}
          </button>
        </div>
      )}

      {/* STEP 4: Payment */}
      {step === 'payment' && order && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Step 4: Payment</h2>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded">
            <p><strong>Order Number:</strong> {order.orderNumber}</p>
            <p><strong>Game:</strong> {order.gameName}</p>
            <p><strong>Package:</strong> {order.packageName}</p>
            <p><strong>Amount:</strong> ₹{order.totalPrice}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p className="text-sm text-gray-600">
              ℹ️ Reseller Order ID: {order.resellerOrderId || 'Not processed yet'}
            </p>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Proceed to Payment
          </button>
        </div>
      )}

      {/* STEP 5: Complete */}
      {step === 'complete' && order && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-green-600">✓ Order Complete!</h2>
          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <p><strong>Order Number:</strong> {order.orderNumber}</p>
            <p><strong>Reseller Order ID:</strong> {order.resellerOrderId}</p>
            <p><strong>Status:</strong> {order.status}</p>
          </div>

          <button
            onClick={checkOrderStatus}
            disabled={loading}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            {loading ? 'Checking...' : 'Refresh Status'}
          </button>
        </div>
      )}
    </div>
  );
}
