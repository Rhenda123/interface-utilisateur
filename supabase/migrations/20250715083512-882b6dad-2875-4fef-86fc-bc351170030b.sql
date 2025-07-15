-- Mettre à jour le mot de passe du compte existant
UPDATE auth.users 
SET encrypted_password = crypt('123456', gen_salt('bf')),
    email_confirmed_at = now(),
    updated_at = now()
WHERE email = 'r.henda@icloud.com';

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
  'cab65fb6-8092-4ac8-b53e-a7b075fef2fb',
  'r.henda@icloud.com',
  'Rami',
  'Henda',
  'monthly',
  'trial',
  now() + interval '30 days',
  now(),
  now()
);