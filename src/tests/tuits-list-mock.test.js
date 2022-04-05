import Tuits from "../components/tuits/index";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {findAllTuits} from "../services/tuits-service";
import axios from "axios";
import 'regenerator-runtime/runtime';
import React from 'react';
import '@testing-library/jest-dom';

jest.mock('axios');

const MOCKED_TUITS = [
    { tuit: "alice's tuit", postedOn: 'March 5 2022', postedBy: 'alice', _id: '1' },
    { tuit: "bob's tuit", postedOn: 'March 4, 2022', postedBy: 'bob', _id: '2' },
    { tuit: "charlie's tuit", postedOn: 'March 3, 2022', postedBy: 'charlie', _id: '3' }
  ];

//test tuit list renders mocked
test('tuit list renders mocked', async () => {
    axios.get.mockImplementation(() =>
    Promise.resolve({ data: {tuits: MOCKED_TUITS} }));
    const response = await findAllTuits();
    const tuits = response.tuits;
    render(
    <HashRouter>
        <Tuits tuits={tuits}/>
    </HashRouter>);
    const tuit = screen.getByText(/bob's tuit/i);
    expect(tuit).toBeInTheDocument();
});