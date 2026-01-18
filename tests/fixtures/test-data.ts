export const TEST_DATA = {
  rooms: {
    fibonacci: {
      name: 'Test Fibonacci Room',
      username: 'TestCreator',
      voteType: 'fibonacci',
      private: false,
    },
    tshirt: {
      name: 'Test T-Shirt Room',
      username: 'TestCreator',
      voteType: 'tshirt',
      private: false,
    },
    privateRoom: {
      name: 'Test Private Room',
      username: 'TestCreator',
      voteType: 'fibonacci',
      private: true,
      prefix: 'secret'
    }
  },
  users: {
    creator: 'TestCreator',
    voter1: 'VoterOne',
    voter2: 'VoterTwo',
    voter3: 'VoterThree'
  },
  votes: {
    fibonacci: ['1', '2', '3', '5', '8', '13', '21', '34', '55', '89'],
    tshirt: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  }
};