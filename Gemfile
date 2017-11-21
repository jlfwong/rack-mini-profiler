source 'http://rubygems.org'

gemspec

gem 'codecov', :require => false, :group => :test
gem 'stackprof', :git => 'https://github.com/tmm1/stackprof.git', :ref => '578043c0bc218509218134f9f91c21dab808c7ff'

if RUBY_VERSION < '2.0.0'
  gem 'json', '~>1.8'
end

if RUBY_VERSION < '2.2.2'
  gem 'rack', '1.6.4'
end

group :development do
  gem 'guard', :platforms => [:mri_22, :mri_23]
  gem 'guard-rspec', :platforms => [:mri_22, :mri_23]
end
