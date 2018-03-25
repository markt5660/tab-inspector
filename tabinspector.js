// Copyright (c) 2018 Mark S. Thew. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Retrieve all windows along with their tabs and pass them to the provided callback.
 * @param {*} callback 
 */
function getTabsByWindow (callback) {
  chrome.windows.getAll({
    populate: true // include tab details
  }, (windows) => {
    callback(windows)
  })
}

/**
 * Retrieve "suspended" tabs stored as bookmarks and pass them to the provided callback.
 * @param {*} callback 
 */
function getSuspendedTabs (callback) {
  chrome.bookmarks.search({
    title: 'Tabli Saved Windows'
  }, (bookmarks) => {
    if (bookmarks) {
      chrome.bookmarks.getChildren(bookmarks[0].id, (bookmarks) => {
        callback(bookmarks)
      })
    }
  })
}

/**
 * Process through each tab of each window and build the tree-view.
 * @param {*} windows 
 */
var loadTabs2 = function (windows) {
  var tree = createTree('tab-tree', 'white')
  for (var i = 0; i < windows.length; i++) {
    var window = windows[i]
    var windowNode = tree.createNode(
      'Window ' + i,
      true,
      (window.focused) ? 'images/monitor.png' : 'images/folder.png',
      null,
      null,
      null)
    for (var t = 0; t < window.tabs.length; t++) {
      var tab = window.tabs[t]
      windowNode.createChildNode(
        tab.title,
        false,
        (tab.active) ? 'images/star.png' : 'images/blue_key.png',
        null,
        null)
    }
  }
  tree.drawTree()
}

/**
 * Load the list of bookmarks into the "suspended tabs" tree.
 * @param {*} bookmarks 
 */
var loadSuspended = function (bookmarks) {
  var treeSuspend = createTree('suspend-tree', 'white')
  if (bookmarks && bookmarks.length > 0) {
    for (var i = 0; i < bookmarks.length; i++) {
      var bookmark = bookmarks[i]
      treeSuspend.createNode(bookmark.title, true, 'images/blue_key.png', null, null, null)
    }
  } else {
    treeSuspend.createNode('Suspend empty', true, 'images/folder.png', null, null, null)
  }
  treeSuspend.drawTree()
}

/**
 * This extension loads the open tabs and displays them in a tree structure.
 */
document.addEventListener('DOMContentLoaded', () => {
//  getTabs(loadTabs1)
  getTabsByWindow(loadTabs2)
  getSuspendedTabs(loadSuspended)
})
