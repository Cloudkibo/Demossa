
exports.statements = {
    fallback : {
        english: {title: 'Other Actions', quickReplies:['Current Package', 'Packages List', 'Unsubscribe Package', 'Register Complaint', 'Complaint Status', ]},
        urdu: {title: 'دیگر اعمال', quickReplies:['موجودا پیکج ', 'پیکیجز', 'پیکج ختم کریں', 'شکایت درج کریں ', 'شکایت کا سٹیٹس']},
        romanurdu: {title: 'Deegar aamaal', quickReplies:['Mojoda Package', 'Package ki malomat', 'Package Khatam karain', 'Shikayat Darj Karain', 'Shikyat Ka Status']}
    },
    wrongotp: {
        english: 'Wrong OTP, Please start again.',
        urdu: 'او ٹی پی درست نہیں ہے دوبارہ کوشش کیجیے',
        romanurdu: 'OTP durust nahi. Dubara koshish keejiye'
    },
    nocustomer: {
        english: 'This phone number does not exist in our database. Please signup by saying hi.'
    },
    signup: {
        exists: {
            english: 'You are already in our database as a registered customer. You can ask us any question here or update your services or information.',
            urdu: 'آپ کا اکاؤنٹ ہمارے ڈیٹا بیس میں رجسٹرڈ یوزر کے طور پر موجود ہے . آپ ہم سے کوئی بھی سوال پوچھ سکتے ہیں اور کوئی بھی سروس یا معلومات کی جانکاری حاصل یا اس میں تبدیلی کر سکتے ہیں',
            romanurdu: 'Aap ka account humaray database mei registered user k tor per mojood hei. App hum se koi bhi sawaal pooch saktey hein aur koi bhi service ya maloomat ki jaankari hasil ya uss mei tabdeeli kar saktey hein'
        },
        success: {
            english: 'Thank you for signing up with us. You can ask us any question here or update your services or information.',
            urdu: 'اکاؤنٹ بنانے کا شکریہ آپ ہم سے کوئی بھی سوال پوچھ سکتے ہیں اور کوئی بھی سروس یا معلومات کی جانکاری حاصل یا اس میں تبدیلی کر سکتے ہیں',
            romanurdu: 'Account banaaney ka shukriya. App hum se koi bhi sawaal pooch saktey hein aur koi bhi service ya maloomat ki jaankari hasil ya uss mei tabdeeli kar saktey hein'
        }
    },
    globalerror: {
        english: 'Sorry, due to some error, we could not complete your request. Contact Admin.',
        urdu: 'معذرت کسی فنی خرابی کے سبب ہم آپ کی درخواست پوری نہیں کر سکے',
        romanurdu: 'Maazrat, kisi fani kharaabi kay sabab hum aapki darkhuwaast poori nahein kar sakay.'
    },
    findCustomer: {
        romanurdu: 'Hamary system main is phone number ka koi user moojood nahi, ap abhi "Hi" likh ker sign up kerskty hain',
        urdu: "ہمارے سسٹم میں اس فون نمبر کے ساتھ کوئی صارف نہیں ملا، آپ اب 'ہیلو' ٹائپ کرکے سائن اپ کرسکتے ہیں",
        english: "No user found with this phone number in our system, You can signup now by typing 'Hi' Here"
    }, 
    findServiceOfCustomer: {
        romanurdu: "'filhal, moojoda number per koi package activated nahi hy'",
        urdu: "فی الحال، اس نمبر پر کوئی پیکج نہیں ہے",
        english: "Currently, there is no package activated on this number"
    },
    complain: {
        exists: {
            english: 'your complaint status is ',
            urdu: 'آپ کی شکایت کی حیثیت ہے',
            romanurdu: 'apki shikayat ka status '
        },
        notExists: {
            english: 'No complaint found with the given complaint id',
            urdu: 'دی گئی شکایت کی شناخت کے ساتھ کوئی شکایت نہیں ملی',
            romanurdu: 'Matloba, compalaint id ki koi bi complain register nahi hy'
        }
    },
    complaints: {
        english: 'currently there is no registered complaint with this phone number',
        urdu: 'فی الحال اس فون نمبر کے ساتھ کوئی رجسٹرڈ شکایت نہیں ہے',
        romanurdu: 'filhal, is number sy koi bi complaint register nahi hy'
    },
    findBundles: {
        english: 'Currently, there is no package available',
        urdu: 'فی الحال، کوئی پیکیج دستیاب نہیں ہے',
        romanurdu: 'filhal, koi bi package available nahi hain'
    },
    findBundleInfo: {
        english: 'We have no service of this name in our system',
        urdu: 'ہمارے سسٹم میں اس نام کی کوئی خدمت نہیں ہے',
        romanurdu: 'hamary pass is naam ki koi service mojood nahi hy'
    },
    updatePackage: {
        english: 'We can not activate this package into your number',
        urdu: 'ہم یہ پیکج آپ کے نمبر میں چالو نہیں کر سکتے ہیں',
        romanurdu: 'Hum apky number per filhal package activate nahi kerskty'
    },
    deletePackage: {
        english: 'We can not de-activate this package into your number',
        urdu: 'ہم اس پیکج کو آپ کے نمبر میں غیر فعال نہیں کر سکتے ہیں',
        romanurdu: 'Hum apky number per filhal ye package de-activate nahi kerskty'
    },
    updateLanguage: {
        english: 'We can not update this Language to your number',
        urdu: 'ہم اس زبان کو آپ کے نمبر پر اپ ڈیٹ نہیں کرسکتے ہیں',
        romanurdu: 'Hum apky number per filhal Language update nahi kerskty'
    }
    
}