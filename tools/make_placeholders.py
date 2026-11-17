"""Generate branded placeholder images for class photos (assets/img/clases/<slug>.webp).

Usage (from the site root): python3 tools/make_placeholders.py
Requires Pillow. Edit CLASSES to add or rename a class.
"""
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
W,H=1200,750
DISPLAY="assets/fonts/barlow-condensed-800-italic-latin.woff2"
SANS="assets/fonts/montserrat-var-normal-latin.woff2"
def sans(size,weight=700):
    f=ImageFont.truetype(SANS,size)
    try: f.set_variation_by_axes([weight])
    except Exception: pass
    return f
CLASSES=[
 ("dance-baby","Grupo Dance Baby","Dance · Peques",(242,0,133)),
 ("dance-intermedio","Grupo Dance Intermedio","Dance",(242,0,133)),
 ("dance-avanzado","Grupo Dance Avanzado","Dance",(242,0,133)),
 ("powerhiit","PowerHIIT","Fitness",(199,125,191)),
 ("aquafitness","Aquafitness","Fitness · Agua",(150,110,230)),
]
logo=Image.open("assets/img/logo.png").convert("RGBA")
def radial(color):
    bg=Image.new("RGB",(W,H),(5,5,5))
    glow=Image.new("RGB",(W,H),(0,0,0)); d=ImageDraw.Draw(glow)
    cx,cy=W//2,int(H*.32)
    for r in range(700,0,-6):
        t=r/700
        c=tuple(int(color[i]*(1-t)**1.2+[132,0,108][i]*t*(1-t)*1.6) for i in range(3))
        d.ellipse((cx-r*1.25,cy-r,cx+r*1.25,cy+r),fill=c)
    return ImageChops.lighter(bg,glow.filter(ImageFilter.GaussianBlur(40)))
for slug,name,tag,color in CLASSES:
    im=radial(color).convert("RGBA")
    wm=logo.resize((int(W*.9),int(logo.height*W*.9/logo.width)),Image.LANCZOS)
    wm.putalpha(wm.getchannel("A").point(lambda v:int(v*.06)))
    im.alpha_composite(wm,((W-wm.width)//2,(H-wm.height)//2-10))
    d=ImageDraw.Draw(im)
    for x in (int(W*.1),int(W*.9)-8):
        bar=Image.new("RGBA",(8,int(H*.46)),(0,0,0,0)); bd=ImageDraw.Draw(bar)
        for y in range(bar.height):
            t=y/bar.height; bd.line([(0,y),(8,y)],fill=tuple(int(255*(1-t)+color[i]*t) for i in range(3))+(255,))
        im.alpha_composite(bar.filter(ImageFilter.GaussianBlur(10)),(x,int(H*.40))); im.alpha_composite(bar,(x,int(H*.40)))
    eb=sans(22,700); title=ImageFont.truetype(DISPLAY,110 if len(name)<16 else 92); chip=sans(22,700)
    eyebrow="NADIA FITNESS DANCE STUDIO"
    ew=sum(d.textlength(ch,font=eb) for ch in eyebrow)+6*(len(eyebrow)-1); x=(W-ew)/2; y=H*.36
    for ch in eyebrow:
        d.text((x,y),ch,font=eb,fill=(255,255,255,215)); x+=d.textlength(ch,font=eb)+6
    t=name.upper(); tw=d.textlength(t,font=title)
    d.text(((W-tw)/2+3,y+48),t,font=title,fill=(0,0,0,160))
    d.text(((W-tw)/2,y+44),t,font=title,fill=(255,255,255))
    ct=tag.upper(); cw=d.textlength(ct,font=chip); cx=(W-cw)/2; cy=y+44+(title.size*1.05)+18
    d.rounded_rectangle((cx-18,cy-10,cx+cw+18,cy+34),radius=22,fill=(30,8,24),outline=color+(255,),width=2)
    d.text((cx,cy-1),ct,font=chip,fill=(255,255,255))
    im.convert("RGB").save(f"assets/img/clases/{slug}.webp","WEBP",quality=84,method=6)
