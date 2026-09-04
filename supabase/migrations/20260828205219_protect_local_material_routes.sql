update public.resources
set external_url = replace(external_url, '/materials/', '/materiais/')
where external_url like '/materials/%';
