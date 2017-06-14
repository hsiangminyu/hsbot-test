module.exports = {

    checkIfUserExist: function (pgClient, userProfile, callback) {
        pgClient.query('SELECT exists(SELECT true FROM hsuser WHERE ID=($1))', [userProfile.userId])
            .on('row', function (row) {
                console.log('checkIfUserExist ' + JSON.parse(JSON.stringify(row)).exists)
                callback(JSON.parse(JSON.stringify(row)).exists)
            })
    },

    saveUser: function (pgClient, userProfile) {
        console.log('saveUser ' + JSON.stringify(userProfile))
        // console.log('saveUser ' + userProfile.userId)
        // console.log('saveUser ' + userProfile.pictureUrl)
        // console.log('saveUser ' + userProfile.statusMessage)
        pgClient.query('INSERT INTO hsuser(id, name, location,pictureurl) values($1, $2, $3, $4)'
            , [userProfile.userId, userProfile.displayName, 'test', userProfile.pictureUrl])
    },

    findActivities: function (pgClient, zone, callback) {

        console.log('(find Activity) ' + zone)
        var activities = []
        pgClient.query('SELECT * FROM activity WHERE zone=($1)', [zone])
            .on('row', function (row, result) {
                result.addRow(row);
            })
            .on('end', function (result) {
                console.log('(find Activity) ' + result.rows.length + ' rows were received');
                console.log('(find Activity) ' + JSON.stringify(result.rows))
                callback(JSON.stringify(result.rows))
            })
    }
}