/**
* @jest-environment node
*/
import {createTuit, deleteTuit,findTuitById, findTuitByUser} from "../services/tuits-service.js";
import {
  createUser,
  deleteUsersByUsername
} from "../services/users-service.js";
import 'regenerator-runtime/runtime' 

describe('can create tuit with REST API', () => {
  let newTuit;
  const temp = {
    username: 'rajesh',
    password: 'rajesh1234',
    email: 'rajesh@gmail.com'
  };
  const testtuit = {
    tuit : 'F-1 2022 championship starts',
    postedOn: "2022-03-19T14:00:00.000Z"
  };

  // setup test before running test
  beforeAll(() => {
    // remove any/all users to make sure we create it in the test
    return deleteUsersByUsername(temp.username) ;
  })

  // clean up after test runs
  afterAll(async() => {
    // remove any data we created
    await deleteTuit(newTuit._id);
    return deleteUsersByUsername(temp.username);
  })

  test('can create tuit with REST API', async () => {

    // insert the user in the database
    const newUser = await createUser(temp);

    // verify new user matches the parameter user
    expect(newUser.username).toEqual(temp.username);
    expect(newUser.password).toEqual(temp.password);
    expect(newUser.email).toEqual(temp.email);
    
    // insert tuit in the database
    newTuit = await createTuit(newUser._id,testtuit);
    expect(newTuit.tuit).toEqual(testtuit.tuit);
    expect(newTuit.postedOn).toEqual(testtuit.postedOn);
    expect(newTuit.postedBy).toEqual(newUser._id);
  });
});

describe('can delete tuit wtih REST API', () => {
  const temp = {
    username: 'rajesh',
    password: 'rajesh1234',
    email: 'rajesh@gmail.com'
  };
  const testTuit = {
    tuit : 'F-1 2022 championship starts',
    postedOn: "2022-03-19T14:00:00.000Z"
  };
  
  // setup test before running test
  beforeAll(async() => {
    return deleteUsersByUsername(temp.username);
  })

  // clean up after test runs
  afterAll(() => {
    // remove any data we created
    return deleteUsersByUsername(temp.username);
  })

  test('can delete tuit wtih REST API', async () => {

    const newUser = await createUser(temp);

    const newTuit = await createTuit(newUser._id, testTuit);
    // delete a user by their username. Assumes user already exists
    const status = await deleteTuit(newTuit._id);

    // verify we deleted at least one user by their username
    expect(status.deletedCount).toBeGreaterThanOrEqual(1);
  });

});

describe('can retrieve a tuit by their primary key with REST API', () => {
  let newTuit;
  const temp = {
    username: 'rajesh',
    password: 'rajesh1234',
    email: 'rajesh@gmail.com'
  };
  const testTuit = {
    tuit : 'F-1 2022 championship starts',
    postedOn: "2022-03-19T14:00:00.000Z"
  };
  
  beforeAll(async() => {
    // remove any/all users to make sure we create it in the test
    return deleteUsersByUsername(temp.username);
  })
// clean up after test runs
afterAll(async() => {
  // remove any data we created
  await deleteTuit(newTuit._id);
  return deleteUsersByUsername(temp.username);
})
test('can retrieve a tuit by their primary key with REST API', async () => {
  // insert new tuits and user in the database
  const newUser = await createUser(temp);
  newTuit = await createTuit(newUser._id, testTuit);
  // find the newly added tuit in the database
  const tuitFound = await findTuitById(newTuit._id);

  // verify inserted tuit's properties match parameter tuit
  expect(newTuit.tuit).toEqual(testTuit.tuit);
  expect(newTuit.postedOn).toEqual(testTuit.postedOn);
  expect(newTuit.postedBy).toEqual(newUser._id);

  // verify we found the tuit that matches the one we added to the database
  expect(tuitFound._id).toEqual(newTuit._id);
  expect(tuitFound.tuit).toEqual(newTuit.tuit);
  expect(tuitFound.postedBy).toEqual(newUser._id);
});

});

describe('can retrieve all tuits with REST API', () => {
  let newTuit1;
  let newTuit2;
  const temp = {
    username: 'rajesh',
    password: 'rajesh1234',
    email: 'rajesh@gmail.com'
  };
  const testTuit1 = {
    tuit : 'F-1 2022 championship starts',
    postedOn: "2022-03-19T14:00:00.000Z"
  };

  const testTuit2 = {
    tuit: 'Liverpool defeats Arsenal',
    postedOn: "2022-03-18T21:00:00.000Z"
  };

  // setup test before running test
  beforeAll(() => {
    // remove any/all users to make sure we create it in the test
    return deleteUsersByUsername(temp.username);
  })

  // clean up after test runs
  afterAll(async () => {
    // remove any data we created
    await deleteTuit(newTuit1._id);
    await deleteTuit(newTuit2._id);
    return await deleteUsersByUsername(temp.username);
  })

  test('can retrieve all tuits with REST API', async () => {
    // insert new tuits and user in the database
    const newUser = await createUser(temp);
    newTuit1 = await createTuit(newUser._id, testTuit1);
    newTuit2 = await createTuit(newUser._id, testTuit2);
    // Find newly inserted tuits in the database
    const tuitsFound = await findTuitByUser(newUser._id);

    // there should be a minimum number of tuits
    expect(tuitsFound.length).toBeGreaterThanOrEqual(2);

    // verify we found all tuits matching the ones added
    expect(tuitsFound[0]._id).toEqual(newTuit1._id);
    expect(tuitsFound[0].tuit).toEqual(newTuit1.tuit);
    expect(tuitsFound[0].postedBy).toEqual(newUser);
    expect(tuitsFound[1]._id).toEqual(newTuit2._id);
    expect(tuitsFound[1].tuit).toEqual(newTuit2.tuit);
    expect(tuitsFound[1].postedBy).toEqual(newUser);
  });
});