-- Supprimer l'ancien compte existant
DELETE FROM auth.users WHERE email = 'r.henda@icloud.com';
DELETE FROM public.profiles WHERE email = 'r.henda@icloud.com';

-- Créer le nouveau compte test avec le bon mot de passe
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token,
  aud,
  role,
  is_super_admin,
  confirmed_at
) VALUES (
  '31b8de5f-5d2b-445f-97b6-d595eb6ab8fc',
  '00000000-0000-0000-0000-000000000000',
  'r.henda@icloud.com',
  crypt('123456', gen_salt('bf')),
  now(),
  null,
  null,
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "Rami", "last_name": "Henda"}',
  now(),
  now(),
  '',
  '',
  '',
  '',
  'authenticated',
  'authenticated',
  false,
  now()
);

-- Créer le profil correspondant
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
) VALUES (
  '31b8de5f-5d2b-445f-97b6-d595eb6ab8fc',
  'r.henda@icloud.com',
  'Rami',
  'Henda',
  'monthly',
  'trial',
  now() + interval '30 days',
  now(),
  now()
);