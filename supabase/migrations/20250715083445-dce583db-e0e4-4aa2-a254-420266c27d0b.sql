-- Supprimer tous les comptes existants avec cet email
DELETE FROM public.profiles WHERE email = 'r.henda@icloud.com';
DELETE FROM auth.users WHERE email = 'r.henda@icloud.com';

-- Créer le nouveau compte test avec un nouvel ID
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  aud,
  role,
  is_super_admin
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'r.henda@icloud.com',
  crypt('123456', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "Rami", "last_name": "Henda"}',
  now(),
  now(),
  'authenticated',
  'authenticated',
  false
);

-- Créer le profil correspondant avec le même ID
INSERT INTO public.profiles (
  id,
  email,
  first_name,
  last_name,
  plan,
  subscription_status,
  subscription_end_date,
  created_at,
  updated_at
) 
SELECT 
  u.id,
  'r.henda@icloud.com',
  'Rami',
  'Henda',
  'monthly',
  'trial',
  now() + interval '30 days',
  now(),
  now()
FROM auth.users u WHERE u.email = 'r.henda@icloud.com';