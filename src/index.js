import searchBox from './controllers/search-box/script';
import ProcessingRequest from './models/processing-request';

const processingRequest = new ProcessingRequest(
  {
    key: 'AIzaSyAc8TqMl112AqFC6u7Nd5vGuwwCtE-o2Vg',
    maxResults: 15,
  },
);

searchBox.processingRequest = processingRequest;

export default processingRequest;
