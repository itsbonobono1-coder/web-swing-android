# Web Swing: من اللعبة لـ APK ثم Google Play

## 0) المطلوب على جهازك
Node.js (النسخة LTS)، وAndroid Studio (بيجي معاه JDK والـSDK).

## 1) جهّز المشروع
1. افتح `capacitor.config.json` وغيّر `appId` لاسم حزمة خاص بيك (مثال: `com.mohamed.webswing`). **مش هتقدر تغيّره بعد النشر.**
2. حمّل خط **Press Start 2P** من Google Fonts (ترخيص OFL مجاني) وحط الملف باسم `PressStart2P-Regular.ttf` جوا مجلد `www`. من غيره اللعبة بتشتغل بخط عادي.
3. من داخل المجلد شغّل: `node setup.js`
   السكربت بيعمل: تثبيت المكتبات، وإضافة منصة أندرويد، وتحديث AndroidManifest (معرّف AdMob، وقفل الشاشة طولي)، وتوليد الأيقونة وشاشة البداية.
4. افتح المشروع: `npx cap open android`

## 2) جرّب على موبايل
وصّل الموبايل (USB debugging) وشغّل من Android Studio بزرار Run. الإعلانات حالياً **تجريبية** (معرّفات جوجل التجريبية) وده الصح للتجربة. **ممنوع تضغط على إعلاناتك الحقيقية بنفسك** عشان ماتتحظرش.

## 3) إعلانات AdMob الحقيقية
1. اعمل حساب على admob.google.com وأضف تطبيق Android جديد.
2. اعمل Ad unit من نوع **Rewarded** وانسخ معرّفين: App ID (فيه `~`) وAd unit ID (فيه `/`).
3. في `www/ads.js` خلّي `TEST = false` وحط الـAd unit ID في `REWARD_ID`.
4. شغّل السكربت بالـApp ID: Windows: `set ADMOB_APP_ID=ca-app-pub-xxx~yyy && node setup.js` / Mac-Linux: `ADMOB_APP_ID=ca-app-pub-xxx~yyy node setup.js` ثم `npx cap sync android`.
5. في AdMob فعّل نموذج الموافقة (Privacy & messaging) لأوروبا والمملكة المتحدة. الكود جاهز يعرضه.
6. أكمل بيانات الدفع والضرائب في AdMob عشان الأرباح تتحول.

## 4) ابني الملف لجوجل (AAB مش APK)
جوجل بلاي بتقبل **AAB** للتطبيقات الجديدة. الـAPK للتجربة والمشاركة بس.
1. اعمل مفتاح التوقيع (مرة واحدة، **احتفظ به وبالباسورد في مكان آمن**): `keytool -genkey -v -keystore release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias webswing`
2. في Android Studio: Build ثم Generate Signed App Bundle / APK ثم Android App Bundle، واختار المفتاح، ثم release.
3. للـAPK للتجربة بس: نفس الخطوات واختار APK.
4. تأكد إن `targetSdk` و`compileSdk` = 36 أو أعلى (قالب Capacitor الجديد بيحطها غالباً). جوجل بتشترط API 36 للتطبيقات الجديدة من 31 أغسطس 2026.

## 5) النشر على Google Play
1. حساب مطوّر في Play Console: رسوم مرة واحدة 25 دولار، وتحقق من الهوية.
2. أنشئ تطبيق جديد وارفع الـAAB في **Internal testing** أولاً للتجربة.
3. ارفع `privacy-policy.md` على أي رابط عام (GitHub Pages مثلاً) بعد ما تملأ بياناتك، وحط الرابط في Play Console.
4. املأ الأقسام: Store listing (أيقونة 512، لقطات شاشة، Feature graphic 1024x500)، Content rating، **Ads = نعم (التطبيق فيه إعلانات)**، Data safety (معرّف الإعلانات وبيانات AdMob)، Target audience (اختار 13+ ومش للأطفال).
5. لو حسابك شخصي اتعمل بعد 13 نوفمبر 2023: لازم **Closed testing بـ 12 مختبر على الأقل** يفضلوا مشتركين **14 يوم متواصلين** قبل ما تقدر تطلب Production.
6. بعد كده Production ثم Send for review. المراجعة ممكن تاخد أيام.

## ملاحظات
- أسماء الشخصيات أصلية (مش شخصيات مارفل). ماتحطش اسم أو صورة سبايدر مان أو فينوم في الاسم أو الوصف أو الأيقونة، لأن ده بيعرّض التطبيق للحذف.
- أي تعديل في اللعبة: عدّل `www/index.html` ثم `npx cap sync android` وابنِ من جديد. ولازم ترفع نسخة بـ `versionCode` أعلى كل مرة.
