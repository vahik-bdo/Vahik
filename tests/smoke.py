"""Browser smoke tests; start python3 -m http.server 8000 first."""
import re
from playwright.sync_api import sync_playwright, expect

URL = 'http://127.0.0.1:8000/'
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    for mobile in [False, True]:
        context = browser.new_context(viewport={'width':390 if mobile else 1280, 'height':844}, is_mobile=mobile, has_touch=mobile)
        context.add_init_script("localStorage.setItem('langChosen','1');localStorage.setItem('tourDone','1');sessionStorage.setItem('prayed','1');sessionStorage.setItem('pfAck','1');")
        page = context.new_page()
        errors, requests = [], []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.on('request', lambda request: requests.append(request.url))
        page.goto(URL)
        expect(page.locator('#brChapterTitle')).to_have_text('Matthew 1')
        translations = [url for url in requests if '/data/translations/' in url]
        assert len(translations)==1 and translations[0].endswith('/en.json'), translations
        assert not any('/assets/audio/' in url for url in requests)
        page.locator('#brNext').click()
        expect(page.locator('#brChapterTitle')).to_have_text('Matthew 2')
        page.wait_for_timeout(900)
        page.locator('#brPrev').click()
        expect(page.locator('#brChapterTitle')).to_have_text('Matthew 1')
        for language, title in [('hy','Մատթեոս 1'),('ru','Матфей 1'),('de','Matthäus 1'),('en','Matthew 1')]:
            page.locator('#lb').click()
            page.locator(f'#lm button[data-l="{language}"]').click()
            expect(page.locator('html')).to_have_attribute('lang', language)
            expect(page.locator('#brChapterTitle')).to_have_text(title)
            assert len(page.locator('#brReader').inner_text()) > 500
        page.locator('#brv-1 .br-like').click()
        expect(page.locator('#brv-1')).to_have_class(re.compile(r'\bliked\b'))
        page.locator('#bFind').evaluate('(el)=>el.click()')
        page.locator('#brSearchInput').fill('Abraham')
        expect(page.locator('.br-result').first).to_be_visible()
        page.locator('#brSearchClose').click()
        link=page.locator('.contact-link')
        expect(link).to_have_attribute('href','https://t.me/vahe100')
        expect(link).to_have_attribute('rel','noopener noreferrer')
        assert page.locator('#brRb').evaluate('e=>getComputedStyle(e).backdropFilter') == ('blur(6px)' if mobile else 'blur(8px) saturate(1.1)')
        page.reload()
        expect(page.locator('#brChapterTitle')).to_have_text('Matthew 1')
        expect(page.locator('#brv-1')).to_have_class(re.compile(r'\bliked\b'))
        assert not errors, errors
        print('PASS:', 'mobile' if mobile else 'desktop', 'languages, navigation, search, favorites, contact, blur, reload')
        context.close()
    # A failed translation download must offer a working retry.
    context=browser.new_context()
    context.add_init_script("localStorage.setItem('langChosen','1');localStorage.setItem('tourDone','1');sessionStorage.setItem('prayed','1');sessionStorage.setItem('pfAck','1');")
    page=context.new_page()
    page.route('**/data/translations/en.json', lambda route: route.fulfill(status=503, body='unavailable'))
    page.goto(URL)
    expect(page.locator('#retryTranslation')).to_be_visible()
    page.unroute('**/data/translations/en.json')
    page.locator('#retryTranslation').click()
    expect(page.locator('#brChapterTitle')).to_have_text('Matthew 1')
    print('PASS: failed translation download and retry')
    context.close()
    # A slow response for a previously selected language cannot overwrite the current one.
    context=browser.new_context()
    context.add_init_script("localStorage.setItem('langChosen','1');localStorage.setItem('tourDone','1');sessionStorage.setItem('prayed','1');sessionStorage.setItem('pfAck','1');")
    page=context.new_page(); pending=[]; errors=[]
    page.on('pageerror',lambda error: errors.append(str(error)))
    page.goto(URL);expect(page.locator('#brChapterTitle')).to_have_text('Matthew 1')
    page.route('**/data/translations/ru.json',lambda route:pending.append(route))
    page.locator('#lb').click();page.locator('#lm button[data-l="ru"]').click()
    expect(page.locator('#bookBody')).to_have_attribute('aria-busy','true')
    page.locator('#lb').click();page.locator('#lm button[data-l="hy"]').click()
    expect(page.locator('#brChapterTitle')).to_have_text('Մատթեոս 1')
    assert pending
    from pathlib import Path
    pending[0].fulfill(status=200,content_type='application/json',body=Path('data/translations/ru.json').read_text())
    page.wait_for_timeout(300)
    expect(page.locator('#brChapterTitle')).to_have_text('Մատթեոս 1')
    assert not errors,errors
    print('PASS: language switch while previous download is pending')
    context.close()
    # Fresh-visit dialogs still work after moving reader initialization to async loading.
    context=browser.new_context();page=context.new_page()
    page.goto(URL)
    page.locator('#lpk button').filter(has_text='English').click()
    page.locator('#pb').click()
    expect(page.locator('#pfm')).to_be_visible()
    page.locator('#pfm .pfb').evaluate('el=>{el.scrollTop=el.scrollHeight;el.dispatchEvent(new Event("scroll"))}')
    page.locator('#pfok').click()
    expect(page.locator('#pfm')).to_have_count(0)
    print('PASS: first-visit language, prayer and preface dialogs')
    context.close()
    browser.close()
