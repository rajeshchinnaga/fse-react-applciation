import {UserList} from "../components/profile/user-list";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {findAllUsers} from "../services/users-service";
import 'regenerator-runtime/runtime' ;
import React from 'react';
import '@testing-library/jest-dom/extend-expect';


test('user list renders async', async () => {
    const users = await findAllUsers();
    render(
      <HashRouter>
        <UserList users={users}/>
      </HashRouter>);
    const linkElement = screen.getByText(/alice/i);
    expect(linkElement).toBeInTheDocument();
  })
  