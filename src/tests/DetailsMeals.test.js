import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
/* import userEvent from '@testing-library/user-event'; */
import React from 'react';
import App from '../App';
/* import DrinksPage from '../pages/DrinksPage'; */
/* import MealsPage from '../pages/MealRecipe'; */
import detailsMeals from './helpers/detailsMeals';
import drinks from './helpers/drinks';
import renderWithRouterAndRedux from './helpers/rendeWithRouterAndRedux';

const mockFetch = (data) => Promise.resolve({
  json: () => Promise.resolve(data),
});

const flushPromises = () => new Promise((r) => { setTimeout(r); });
const startRecipeBtnId = 'start-recipe-btn';

describe('Testand details Meals', () => {
  beforeEach(() => {
    const mockMultFetch = jest.fn()
      .mockReturnValueOnce(mockFetch(detailsMeals))
      .mockReturnValueOnce(mockFetch(drinks));
    global.fetch = mockMultFetch;
  });
  const mockFavorites = 'favoriteRecipes';
  const listFavorites = [{
    id: '52977',
    nationality: 'Turkish',
    name: 'Corba',
    image: 'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg',
  }];
  const setLocalStorage = (id, data) => {
    window.localStorage.setItem(id, JSON.stringify(data));
  };
  /* const startRecipeBtnId = 'start-recipe-btn'; */
  setLocalStorage(mockFavorites, listFavorites);
  test('Meals details', async () => {
    await flushPromises();
    expect(localStorage.getItem(mockFavorites)).toEqual(JSON.stringify(listFavorites));
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/meals/52977');

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(screen.getByText('Corba')).toBeInTheDocument();

    const photo = screen.getByTestId('recipe-photo');
    expect(photo).toBeInTheDocument();
    const recomendation = screen.getByTestId('0-recommendation-card');
    expect(recomendation).toBeInTheDocument();
    const btnFavorite = screen.getByTestId('favorite-btn');
    expect(btnFavorite).toBeInTheDocument();
    userEvent.click(btnFavorite);
    setLocalStorage(mockFavorites, listFavorites);
    const shareButton = screen.getByTestId('share-btn');
    window.document.execCommand = jest.fn().mockImplementation(() => ' ');
    userEvent.click(shareButton);
    const linkCopied = screen.getByText('Link copied!');
    expect(linkCopied).toBeInTheDocument();
    const startRecipeBtn = screen.getByTestId(startRecipeBtnId);
    userEvent.click(startRecipeBtn);
    /* expect(window.location.pathname).toBe('/drinks/178319/in-progress'); */
    global.fetch.mockClear();
  });
});
