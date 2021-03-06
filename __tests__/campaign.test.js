require('dotenv').config();
const app = require('../lib/app');
const request = require('supertest');
const { getUser, getAddress, getCampaign, getPostcard } = require('../db/data-helpers');

describe('Campaign model', () => {
  it('creates a campaign', async() => {
    
    const user = await getUser();
    const address = await getAddress();
    const defaultPostcard = await getPostcard();

    return request(app)
      .post('/api/v1/campaigns/')
      .send({ 
        userId: user._id,
        title: 'Test Campaign', 
        recipient: 'John Doe',
        addressId: address._id,
        defaultPostcardId: defaultPostcard._id,
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          userId: user._id,
          title: 'Test Campaign', 
          description: '', 
          recipient: 'John Doe',
          addressId: address._id,
          defaultPostcardId: defaultPostcard._id,
          // postcards: expect.any(Array)
        });
      });
  });


  it('gets all campaigns', async() => {

    return request(app)
      .get('/api/v1/campaigns')
      .then(res => {
        expect(res.body).toContainEqual({
          _id: expect.any(String),
          userId: expect.any(String), 
          title: expect.any(String), 
          description: expect.any(String),
          recipient: expect.any(String),
          addressId: expect.any(String),
          defaultPostcardId: expect.any(String),
          // postcards: expect.any(Array),
        });
      });
  });


  it('gets a specific campaign', async() => {

    const campaign = await getCampaign();
    const address = await Promise.resolve(fetchAddress(campaign.addressId));

    async function fetchAddress(id) {
      return request(app)
        .get(`/api/v1/addresses/${id}`)
        .then(res => res.body);
    }

    return request(app)
      .get(`/api/v1/campaigns/${campaign._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: campaign._id,
          userId: campaign.userId, 
          title: campaign.title, 
          description: campaign.description,
          recipient: campaign.recipient,
          addressId: {
            _id: address._id,
            city: address.city,
            state: address.state,
            street1: address.street1,
            street2: address.street2,
            zip: address.zip
          },
          defaultPostcardId: campaign.defaultPostcardId,
          postcards: campaign.postcards,
        });
      });
  });

});
