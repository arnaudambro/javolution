---
title: 'Publishing your App in the Stores: feedback on the reviewing process'
date: '2021-07-05'
spoiler: 'Things to keep in mind to prevent any misadventures'
cover: ./coeur-avec-les-chiffres.png
cta: 'JavaScript'
tags: 'JavaScript'
---

While a web app is quite straight forward to update, it's not the same story for a native iOS/Android app, because Apple and Google require a review from your app before publishing it on their stores.

With two direct consequences

- once your app is published, you can't really hotfix a critical bug, as you'll need their approval first, and you can't rollback unless you unpublish your app, which is... not something you want to do as it's permanent
- an update takes time, and you never know how much time there will be between the time you wish it was online and the time it's really ready to be online - could be minutes, hours or days.

# Apple Store review

Let's review them first, as they are the most professionnal and predictable.

## A human checks your app - it's good to prevent bugs in production

Apple really review your app, I mean with real human behind a real device. There might be some bots for certain parts of the app, for sure, but there are humans too. Which is a good point : if your app doesn't even start, it won't be accepted. Believe me, if you forgot to change your localhost into your real API route, it's really nice to have this human control to prevent a crashy app being downloaded hundreds of time.

## A human checks your app - it takes time

That being said, don't expect your app to be reviewed and validated quickly - this is very rare. I never witnessed less than 5-6 hours as far as I remember, and most of the time it's around 24 hours.

## A human checks your app - not always the same, not always the same review

That's almost all - one last point, not so important but to be mentionned : your app might be accepted once, and a perfect copy of this accepted version might be rejected on a later submission. Yes it can happen. Maybe because it's a human check, I don't know, but sometimes a reviewer says "your screenshot are not suitable anymore" or "you need to let the user be able to report somewhere", whereas this version differs from the previous just with a typo fix. Be prepared.

## The [form for "critical bug: please expedite my review"](https://idmsa.apple.com/IDMSWebAuth/signin.html?path=%2Fcontact%2Fapp-store%2F%3Ftopic%3Dexpedite&appIdKey=891bd3417a7776362562d2197f89480a8547b108fd934911bcbea0110d07f757) is just a joke

I used the [form](https://idmsa.apple.com/IDMSWebAuth/signin.html?path=%2Fcontact%2Fapp-store%2F%3Ftopic%3Dexpedite&appIdKey=891bd3417a7776362562d2197f89480a8547b108fd934911bcbea0110d07f757) twice, and it didn't change anything. I received an answer 5 hours later from Apple saying

> Hello Arnaud, Thank you for contacting App Store Review to request an expedited review. We have made a one-time exception and will proceed with an expedited review of your App.

Oh, you're so fast, thanks !

Then it took them at least the same amount of time to complete the review. I don't call this expedite. Don't rely on this, and keep in mind : if you threw a bug in production, you're flucked for a few hours before the hotfix is there.

# Google review

Google Play Store's reviewing process is much less reliable than Apple's. Let's see the pros and cons of it.

## No human checks your app everytime - it's much faster than Apple, sometimes

It usually takes a couple of hours for an app to be ready for publishing after a review. But sometimes not. Sometimes it takes days.
Google has been warning for years already that "Due to adjusted work schedules at this time, you may experience longer than usual review times for your app.".
I've published dozens of time, and 98% of the time, in a couple of hours the new version is in the air. But the last one took more than 48 hours. Keep it in mind.

## No human checks your app everytime - it's NOT good to prevent bugs in production

This 48 hours check was the first time for me that it took so long, so I couldn't expect it, And because I didn't expect, I've always had in mind that a bug fix for an Android app would be a quick task. So I've always been a bit less strict with myself regarding testing of android apps.

Don't be. Be even more. Believe me, you don't want a brand new version of your app released with a fatal failure at the opening (like a `localhost` instead of a proper API host name) and stuck for 48 hours in the Store.

That's right: because no human checks your app everytime in Google Play Store, you can publish an app that doesn't work.

# Overall: No consistency

That's what should be in every mind when it's about releasing in the Stores : some day they will review and accept a version of your app, the next day, whereas you just fixed a tiiiny little ut critical bug, they will reject it because they saw something else somewhere else, that had been here for months, and that never was a problem, so you also have to fix it even if it takes a couple of days to do so, and they will afterwards take forever to review and approve your app release.

So to sum-up :

- always test your app before submitting for review - especially for Google
- always expect 3 days before your app being approved, or even a week to be certain that if there will be a rejection you acn still re-submit on time
- you should figure out a process to force update your app from your backend at a very early stage, like WhatsApp and a lot of apps do : neither Apple or Google offer any service like that.
- delegate to your backend what can be delegated there : it's easier to handle changes from the backend than from the native apps, because you have control over the backend, but you have no control over the app
