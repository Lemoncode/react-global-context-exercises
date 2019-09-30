import React from 'react';
import { fetchHotelCollection } from './hotel-collection.api';
import { mapFromApiToVm } from './hotel-collection.mapper';
import { mapCollection } from 'common/mappers';

export const useHotelCollection = () => {
  const [hotelCollection, setHotelCollection] = React.useState([]);

  const onFetchHotelCollection = () =>
    fetchHotelCollection().then(hotels =>
      setHotelCollection(mapCollection(hotels, mapFromApiToVm))
    );

  return { hotelCollection, onFetchHotelCollection };
};
