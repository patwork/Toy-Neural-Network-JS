function trainEpoch(training) {
  shuffle(training, true);
  console.log('training...');
  // Train for one epoch
  for (let i = 0; i < training.length; i++) {
    let data = training[i];
    let inputs = Array.from(data).map(x => x / 255);
    let label = training[i].label;
    let targets = [0, 0, 0];
    targets[label] = 1;
    // console.log(inputs);
    // console.log(targets);
    nn.train(inputs, targets);
  }
}

function testAll(testing) {

  const NAMES = [ 'cat', 'rainbow', 'train' ];
  let correct = 0;
  let mistakes = [];
  let guesses = [];
  let img = createImage(28, 28);
  let bg;

  // Train for one epoch
  for (let i = 0; i < testing.length; i++) {
    // for (let i = 0; i < 1; i++) {
    let data = testing[i];
    let inputs = Array.from(data).map(x => x / 255);
    let label = testing[i].label;
    let guess = nn.predict(inputs);

    let m = max(guess);
    let classification = guess.indexOf(m);
    // console.log(guess);
    // console.log(classification);
    // console.log(label);

    if (classification === label) {
      correct++;
      bg = [ 255, 255, 255, 255 ];
    } else {
      let id = NAMES[label] + ':' + NAMES[classification];
      mistakes[id] = (mistakes[id] ? mistakes[id] + 1 : 1);
      guesses.push([ i, NAMES[label], NAMES[classification], guess[0], guess[1], guess[2] ]);
      bg = [ 200, 200, 200, 255 ];
      bg[classification] = 255;
    }

    img.loadPixels();
    for(let y = 0; y < 28; y++) {
      for(let x = 0; x < 28; x++) {
        let color = 255 - data[y * 28 + x];
        if (color == 255) {
          img.set(x, y, bg);
        } else {
          img.set(x, y, [ color, color, color, 255]);
        }
      }
    }
    img.updatePixels();
    image(img, i % 25 * 28, Math.floor(i / 25) * 28);

  }

  console.table(mistakes);
  console.table(guesses);

  let percent = 100 * correct / testing.length;
  return percent;

}
