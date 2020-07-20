require('dotenv').config();
const app = require('../lib/app');
const request = require('supertest');
const mongoose = require('mongoose');
const { getUser, getAddress, getCampaign } = require('../db/data-helpers');
const Campaign = require('../lib/models/Campaign');

describe('Campaign model', () => {
  it('creates a campaign', async() => {
    
    const user = getUser();
    const address = getAddress();

    await Campaign.create({ 
      author: mongoose.Types.ObjectId(user._id),
      title: 'Test Campaign', 
      recipient: 'John Doe',
      address: mongoose.Types.ObjectId(address._id),
      postcard: 'postcard._id to come',
    });
    return request(app)
      .post('/api/v1/campaigns/')
      .send({ 
        author: user._id,
        title: 'Test Campaign', 
        recipient: 'John Doe',
        address: address._id,
        postcard: 'postcard._id to come' 
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          author: user._id,
          title: 'Test Campaign', 
          description: '', 
          recipient: 'John Doe',
          address: address._id,
          postcard: 'postcard._id to come' 
        });
      });
  });

  it('gets a specific campaign', async() => {

    const campaign = await getCampaign();

    return request(app)
      .get(`/api/v1/campaigns/${campaign._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: campaign._id,
          author: campaign.author, 
          title: campaign.title, 
          description: campaign.description,
          recipient: campaign.recipient,
          address: campaign.address,
          postcard: campaign.postcard,
        });
      });
  });


});