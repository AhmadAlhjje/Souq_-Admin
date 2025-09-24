FROM node:18-alpine

WORKDIR /app

# نسخ package files
COPY package*.json ./

# تثبيت التبعيات
RUN npm install

# نسخ الكود المصدري
COPY . .

# بناء المشروع
RUN npm run build

# متغيرات البيئة
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# إنشاء مستخدم
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

CMD ["npm", "start"]