var drivelist = require('drivelist')
var current = []

module.exports = {
  driveAdded: undefined,
  driveRemoved: undefined,
  begin: begin
}

function scan(delay) {
  drivelist.list(function(error, drives) {
    if (error) {
      throw error
    }

    // loop through, checking for drive additions
    for (var i = 0; i < drives.length; i++) {
      var found = false
      for (var j = 0; j < current.length; j++) {
        if (JSON.stringify(current[j]) === JSON.stringify(drives[i])) {
          found = true
        }
      }

      if (!found) {
        // new drive found
        if (module.exports.driveAdded !== undefined) {
          module.exports.driveAdded(drives[i])
        }
      }
    }

    // now loop through the opposite way, checking for drive removals
    for (var i = 0; i < current.length; i++) {
      var found = false
      for (var j = 0; j < drives.length; j++) {
        if (JSON.stringify(drives[j]) === JSON.stringify(current[i])) {
          found = true
        }
      }

      if (!found) {
        // drive has been removed
        if (module.exports.driveRemoved !== undefined) {
          module.exports.driveRemoved(drives[i])
        }
      }
    }

    // update the current drives
    current = JSON.parse(JSON.stringify(drives))

    // wait for delay, and run this loop again
    setTimeout(function() {
      scan(delay)
    }, delay)
  })
}

function begin(delay, drives) {
  if (typeof delay === 'undefined') {
    delay = 5000
  }

  if (typeof drives !== 'undefined') {
    current = drives
  }

  scan(delay)
}
