// const zongji = new ZongJi({ /* ... MySQL Connection Settings ... */ });

// // Each change to the replication log results in an event
// zongji.on('binlog', function(evt) {
//   evt.dump();
// });

// // Binlog must be started, optionally pass in filters
// zongji.start({
//   includeEvents: ['tablemap', 'writerows', 'updaterows', 'deleterows'],
// });

// const mysqlevents = require('mysql-events');
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'password',
// });

// const mysqleventwatcher = mysqlevents(connection);
// const watcher = mysqleventwatcher.add(
//     'fantasy_collecting.students',
//     function(oldRow, newRow, event) {
//       // row inserteds
//       if (oldRow === null) {
//         console.log('ROW CREATED');
//       }
//       // row deleted
//       if (newRow === null) {
//         console.log('ROW DELETED');
//       }
//       // row updated
//       if (oldRow !== null && newRow !== null) {
//         console.log('ROW UPDATED');
//       }
//       console.log('EVENT HAPPENED');
//       console.log(event);
//     },
// );
