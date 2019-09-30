import React from 'react';
import { history, linkRoutes } from 'core/router';
import { createEmptyHotel, createEmptyHotelErrors } from './hotel-edit.vm';
import { formValidation } from './hotel-edit.validation';
import { getCities } from './api';
import { HotelEditComponent } from './hotel-edit.component';

export const HotelEditContainer = props => {
  const [hotel, setHotel] = React.useState(createEmptyHotel());
  const [hotelErrors, setHotelErrors] = React.useState(
    createEmptyHotelErrors()
  );
  const [cities, setCities] = React.useState([]);

  React.useEffect(() => {
    getCities().then(setCities);
  }, []);

  const onFieldUpdate = (fieldId, value) => {
    setHotel({
      ...hotel,
      [fieldId]: value,
    });

    formValidation.validateField(fieldId, value).then(validationResult => {
      setHotelErrors({
        ...hotelErrors,
        [fieldId]: validationResult,
      });
    });
  };

  const handleSave = () => {
    formValidation.validateForm(hotel).then(formValidationResult => {
      if (formValidationResult.succeeded) {
        history.push(linkRoutes.hotelCollection);
      } else {
        setHotelErrors(formValidationResult.fieldErrors);
      }
    });
  };

  return (
    <HotelEditComponent
      hotel={hotel}
      cities={cities}
      onFieldUpdate={onFieldUpdate}
      hotelErrors={hotelErrors}
      onSave={handleSave}
    />
  );
};
