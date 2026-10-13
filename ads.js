/* Google AdMob rewarded ads for the Capacitor APK. Defines window.showRewardedAd(cb) used by the game.
   cb(true) = the player watched the whole ad (give the reward). cb(false, 'NOT_READY' | 'ERROR') = no reward. */
(function () {
  'use strict';
  var TEST = true; // <<< set to false before you publish, and put YOUR real rewarded ad unit id below
  var REWARD_ID = TEST ? 'ca-app-pub-3940256099942544/5224354917' : 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY';
  var AdMob = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.AdMob;
  if (!AdMob) return; // running in a normal browser: the game shows its placeholder ad
  var ready = false, loading = null;
  function load() {
    if (ready) return Promise.resolve(true);
    if (loading) return loading;
    loading = AdMob.prepareRewardVideoAd({ adId: REWARD_ID, isTesting: TEST })
      .then(function () { ready = true; loading = null; return true; })
      .catch(function () { loading = null; return false; });
    return loading;
  }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  AdMob.initialize({ initializeForTesting: TEST }).catch(function () {})
    .then(function () { // GDPR / UMP consent form (required for users in the EEA/UK)
      return AdMob.requestConsentInfo().then(function (i) {
        if (i && i.isConsentFormAvailable && i.status === 'REQUIRED') return AdMob.showConsentForm();
      }).catch(function () {});
    })
    .then(load);
  window.showRewardedAd = function (cb) {
    var got = false, hs = [], done = false;
    function fin(ok, err) {
      if (done) return; done = true;
      hs.forEach(function (h) { try { h.remove(); } catch (e) {} });
      ready = false; cb(ok, err); load();
    }
    Promise.race([load(), wait(8000).then(function () { return false; })]).then(function (ok) {
      if (!ok && !ready) { fin(false, 'NOT_READY'); return; }
      Promise.all([
        AdMob.addListener('onRewardedVideoAdReward', function () { got = true; }),
        AdMob.addListener('onRewardedVideoAdDismissed', function () { setTimeout(function () { fin(got); }, 300); }),
        AdMob.addListener('onRewardedVideoAdFailedToShow', function () { fin(false, 'ERROR'); })
      ]).then(function (h) { hs = h; return AdMob.showRewardVideoAd(); })
        .catch(function () { fin(false, 'ERROR'); });
    });
  };
})();
