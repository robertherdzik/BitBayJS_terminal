

  var blessed = require('blessed')
     , contrib = require('blessed-contrib')
     , screen = blessed.screen()
     , donut = contrib.donut({
    label: 'Test',
    radius: 8,
    arcWidth: 3,
    remainColor: 'black',
    yPadding: 2,
    data: [
      {percent: 80, label: 'web1', color: 'green'}
    ]})


   screen.append(donut) //must append before setting data
  donut.setData([
    {percent: 87, label: 'rcp','color': 'green'},
  {percent: 43, label: 'rcp','color': 'cyan'},
   ]);

   screen.key(['escape', 'q', 'C-c'], function(ch, key) {
     return process.exit(0);
   });

   screen.render()