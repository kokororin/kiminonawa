#!/usr/bin/env node
'use strict';

const got = require('got');
const co = require('co');
const termImg = require('term-img');

const names = {
  'Tachibana taki': '立花瀧',
  'Miyamizu Mitsuha': '宮水三葉'
};

co(function*() {
  const nameKeys = Object.keys(names);
  const nameKey = nameKeys[Math.floor(Math.random() * nameKeys.length)];
  const response = yield searchIllust(names[nameKey]);
  const data = response.body;
  if (data.status === 'success') {
    const works = data.response;
    const randomKey = Object.keys(works)[Math.floor(Math.random() * Object.keys(works).length)];
    const imageURL = works[randomKey].image_urls.px_480mw;
    const imageBuffer = yield fetchImageBuffer(imageURL);
    console.log('Your name is ' + names[nameKey] + ' (' + nameKey + ')');
    termImg(imageBuffer, {
      fallback: fallback
    });
  } else {
    console.log('pixiv API Error occurred');
  }
});

function fallback() {
  console.log('only supported on iTerm >=3.');
}

function searchIllust(keyword) {
  keyword = encodeURIComponent(keyword);
  return got('https://public-api.secure.pixiv.net/v1/search/works.json?image_sizes=px_128x128%2Cpx_480mw%2Clarge&period=all&include_stats=true&page=1&order=desc&q='
    + keyword +
    '&sort=date&mode=tag&include_sanity_level=true&per_page=100', {
      json: true,
      headers: {
        Host: 'public-api.secure.pixiv.net',
        Authorization: 'Bearer WHDWCGnwWA2C8PRfQSdXJxjXp0G6ULRaRkkd6t5B6h8',
        'User-Agent': 'PixivIOSApp/5.6.0'
      }
    });
}

function fetchImageBuffer(url) {
  return got(url, {
    encoding: null,
    headers: {
      Referer: 'http://www.pixiv.net/'
    }
  }).then(function(response) {
    return response.body;
  });
}