FROM node:18-alpine

WORKDIR /app

# تثبيت الأدوات المطلوبة
RUN apk add --no-cache libc6-compat

# نسخ package files وتثبيت التبعيات
COPY package*.json ./

# تثبيت جميع التبعيات (بما فيها dev) للبناء
RUN npm install

# نسخ الكود المصدري
COPY . .

# بناء المشروع
RUN npm run build

# حذف التبعيات الغير ضرورية (devDependencies) بعد البناء
RUN npm prune --production

# إعداد متغيرات البيئة
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# إنشاء مستخدم لتشغيل الحاوية بدون صلاحيات root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
