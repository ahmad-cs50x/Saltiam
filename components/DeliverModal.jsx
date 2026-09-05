'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { api } from '../src/lib/apiClient';

const DeliverModal = ({ isOpen, onClose, onLocationSaved, savedLocation }) => {
  const { status } = useSession();
  const [location, setLocation] = useState({ country: '', postalCode: '', address: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isOpen || status !== 'authenticated') return;

    // Populate immediately from Header, then refresh from the database.
    if (savedLocation) {
      setLocation({
        country: savedLocation.country || '',
        postalCode: savedLocation.postalCode || '',
        address: savedLocation.address || '',
      });
    }

    api.get('/api/delivery-location')
      .then(({ data }) => setLocation({
        country: data.deliveryLocation?.country || '',
        postalCode: data.deliveryLocation?.postalCode || '',
        address: data.deliveryLocation?.address || '',
      }))
      .catch(() => setMessage('Could not load your saved location.'));
  }, [isOpen, status, savedLocation]);

  const saveLocation = async () => {
    if (status !== 'authenticated') { setMessage('Please sign in to save a delivery location.'); return; }
    setSaving(true);
    setMessage('');
    try {
      const { data } = await api.put('/api/delivery-location', location);
      setLocation(data.deliveryLocation);
      onLocationSaved?.(data.deliveryLocation);
      window.dispatchEvent(new CustomEvent('delivery-location-updated', { detail: data.deliveryLocation }));
      toast.success('Delivery location saved successfully!');
      onClose();
    }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Could not save location.'); }
    finally { setSaving(false); }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}>
        <button className="absolute right-3 top-3" onClick={onClose}>
        <Image src="/close.png" alt="Close" width={24} height={24} />
        </button>

        <h2 className="text-lg text-black text-center font-semibold mb-6">
          Choose your location
        </h2>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Enter your address or select a saved location to see availability and delivery options.
        </p>

        {message && <p className="mb-3 text-center text-sm text-red-600">{message}</p>}
        <input
          type="text"
          placeholder="Country"
          value={location.country}
          onChange={(event) => setLocation({ ...location, country: event.target.value })}
          className="w-full border border-gray-300 rounded-md text-black px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-rose-500"/>
        <input
          type="text"
          placeholder="Zip / Postal Code"
          value={location.postalCode}
          onChange={(event) => setLocation({ ...location, postalCode: event.target.value })}
          className="w-full border border-gray-300 rounded-md text-black px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-rose-500"/>
        <input
          type="text"
          placeholder="Enter address"
          value={location.address}
          onChange={(event) => setLocation({ ...location, address: event.target.value })}
          className="w-full border border-gray-300 rounded-md text-black px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-rose-500"/>

        <button
          onClick={saveLocation}
          disabled={saving}
          className="w-full bg-rose-600 text-white py-2 rounded-md hover:bg-rose-700">
          {saving ? 'Saving...' : 'Save location'}
        </button>
      </div>
    </div>
  );
};

export default DeliverModal;
