
async function sendRating(artwork, rating) {
  await fetch(apiURL + '/ratetable/'+artwork, {
    method: 'post',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(
        {rating: rating})
  })
}

async function getAverageOfRatings(artwork) {
  const ratings = await fetch(apiURL + '/ratetable/'+artwork, {
    method: 'get',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
  }});
  var average = 0;
  for(var i in ratings) {
    average += parseInt(ratings[r].rating);
    if(i === ratings.length-1) average /= 2;
  }
  return average;
}