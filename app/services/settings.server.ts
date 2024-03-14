import { mongodb } from '~/utils/db.server';
import type { FindOptionsClient } from './constants.server';
import { newRecordCommonField } from './constants.server';
import { hashPassword } from './auth.server';

export interface ISearch {
  $match: {
    'user.username'?: {
      $regex: string;
      $options: string;
    };
  };
}

export async function getTotalActionsHistory({
  searchText,
}: {
  searchText: string;
}) {
  const $search: ISearch = { $match: {} };

  if (searchText) {
    $search.$match['user.username'] = {
      $regex: searchText,
      $options: 'i',
    };
  }

  const result = await mongodb
    .collection('actionsHistory')
    .aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      $search,
      { $count: 'total' },
    ])
    .toArray();

  return result.length > 0 ? result[0].total : 0;
}

export async function getActionsHistory({
  skip,
  limit,
  projection,
  searchText,
}: FindOptionsClient & { searchText: string }) {
  const $search: ISearch = { $match: {} };

  if (searchText) {
    $search.$match.username = {
      $regex: searchText,
      $options: 'i',
    };
  }

  const actionsHistory = await mongodb
    .collection('actionsHistory')
    .aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      { $sort: { createdAt: -1 } },
      { $project: { ...projection } },
      $search,
      { $skip: skip },
      { $limit: limit },
    ])
    .toArray();

  return actionsHistory;
}

export async function getTotalUsers() {
  const total = await mongodb.collection('users').count({});

  return total;
}

export async function getUsers({ skip, limit, projection }: FindOptionsClient) {
  const usersCol = mongodb.collection('users');
  const users = await usersCol
    .find(
      {},
      {
        sort: {
          createdAt: -1,
        },
        projection: {
          ...projection,
        },
        skip,
        limit,
      },
    )
    .toArray();

  return users;
}

export async function createNewUser({
  username,
  password,
  email,
  cities,
}: any) {
  const usersCol = mongodb.collection('users');
  const passwordHashed = await hashPassword(password);

  await usersCol.insertOne({
    ...newRecordCommonField(),
    username,
    email,
    cities,
    services: { password: { bcrypt: passwordHashed } },
  });
}
