import React from 'react';
import { withRouter } from 'react-router-dom';
import { useTracked } from 'core/context';
import { history, linkRoutes } from 'core/router';
import { createEmptyHotel, createEmptyHotelErrors } from './hotel-edit.vm';
import { formValidation } from './hotel-edit.validation';
import { getCities } from './api';
import { HotelEditComponent } from './hotel-edit.component';

const InnerHotelEditContainer = props => {
  const { match } = props;
  const [state, dispatch] = useTracked();
  const [hotel, setHotel] = React.useState(createEmptyHotel());
  const [hotelErrors, setHotelErrors] = React.useState(
    createEmptyHotelErrors()
  );
  const [cities, setCities] = React.useState([]);

  React.useEffect(() => {
    getCities().then(setCities);
  }, []);

  React.useEffect(() => {
    const selectedHotel = state.hotelCollection.find(
      h => h.id === match.params.id
    );
    setHotel(selectedHotel ? selectedHotel : createEmptyHotel());
  }, [match.params.id]);

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
        const hotelCollection = state.hotelCollection.map(h =>
          h.id === hotel.id
            ? {
                ...hotel,
              }
            : h
        );
        dispatch({ hotelCollection });
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

export const HotelEditContainer = withRouter(InnerHotelEditContainer);
